import User from '../entity/user';
import {
    AuthGoogleRequest,
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
    TokenPayload,
} from '../model/user';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import GeneralError, {
    BadRequest,
    Conflict,
    NotFound,
    Unathorized,
} from '../model/error';
import Joi from 'joi';
import { OAuth2Client } from 'google-auth-library';

const signUpValidator = Joi.object<SignUpRequest>({
    name: Joi.string().required().min(6).max(128),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(64),
});

const signInValidator = Joi.object<SignUpRequest>({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(64),
});

const authGoogleValidator = Joi.object<AuthGoogleRequest>({
    idToken: Joi.string().required(),
});

class UserService {
    userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async signUp(req: SignUpRequest): Promise<SignUpResponse> {
        const error = signUpValidator.validate(req).error;
        if (error) throw error;

        const userExists = await this.userRepository.findOne({
            where: { email: req.email },
        });
        if (userExists) throw new Conflict('Email already exists');

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.password, salt);

        const user = this.userRepository.create({
            name: req.name,
            email: req.email,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        const token = generateToken(user.id);
        if (!token) {
            console.error('Failed to generate token');
            throw new GeneralError('Server error');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            token: token,
        };
    }

    async signIn(req: SignInRequest): Promise<SignInResponse> {
        const error = signInValidator.validate(req).error;
        if (error) throw error;

        const user = await this.userRepository.findOne({
            where: { email: req.email },
        });
        if (!user) throw new NotFound('User not found');

        const paswordMatch = await bcrypt.compare(req.password, user.password);
        if (!paswordMatch) throw new BadRequest("password doesn't match");

        const token = generateToken(user.id);
        if (!token) {
            console.error('Failed to generate token');
            throw new GeneralError('Server error');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            token: token,
        };
    }

    verivy(token: string): number {
        const decoded = verifyToken(token);
        if (!decoded) throw new Unathorized('Token is not valid');

        return decoded.userId;
    }

    async getUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFound('User not found');
        return user;
    }

    async authGoogle(req: AuthGoogleRequest): Promise<SignInResponse> {
        const error = authGoogleValidator.validate(req).error;
        if (error) throw error;

        const clientId = process.env.CientId;
        const client = new OAuth2Client(clientId);
        const idToken = req.idToken;
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: clientId,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new NotFound('Authentication failed');
        let user = await this.userRepository.findOne({
            where: { email: payload.email },
        });

        if (!user) {
            // Sign up
            const newUser = this.userRepository.create({
                email: payload.email,
                name: payload.name,
                photo: payload.picture,
            });

            user = await this.userRepository.save(newUser);
        }

        if (!user) throw new GeneralError('Internal server error');

        const token = generateToken(user.id);
        if (!token) {
            console.error('Failed to generate token');
            throw new GeneralError('Server error');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            token: token,
        };
    }
}

const generateToken = (userId: number) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const payload: TokenPayload = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        iat: Math.floor(Date.now() / 1000),
        userId: userId,
    };

    const token = jwt.sign(payload, secret);

    return token;
};

const verifyToken = (token: string): TokenPayload | null => {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    try {
        return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
        return null;
    }
};

export default UserService;
