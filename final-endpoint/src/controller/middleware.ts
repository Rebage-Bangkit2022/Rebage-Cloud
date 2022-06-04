import { Request, Response, NextFunction } from 'express';
import GeneralError, { Forbidden, Unathorized } from '../model/error';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../model/user';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers['authorization'];
        if (typeof authorization !== 'string') throw new Forbidden("You don't have authorization");

        // The format of this header is:
        // Bearer requested_token
        const token = authorization.split(' ')[1];
        if (!token) throw new Unathorized('Token format is invalid');

        const userId = verivy(token);
        req.userId = userId;
    } catch (error) {
        return GeneralError.handle(error, res);
    }

    return next();
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

const verivy = (token: string): number => {
    const decoded = verifyToken(token);
    if (!decoded) throw new Unathorized('Token is not valid');

    return decoded.userId;
};
