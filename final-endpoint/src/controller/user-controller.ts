import express, { NextFunction, Router } from 'express';
import UserService from '../service/user-service';
import { Request, Response } from 'express';
import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from '../model/user';
import Web from 'src/model/web';
import GeneralError, { Forbidden, Unathorized } from '../model/error';

class UserController {
    userService: UserService;
    router: Router;

    constructor(userService: UserService, router?: Router) {
        this.userService = userService;
        const r = router ?? express.Router();
        this.router = r;

        r.post('/api/user/signup', this.signUp);
        r.post('/api/user/signin', this.signIn);
        r.get('/api/user', this.auth, this.getUser);
    }

    signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response<Web<SignUpResponse>>) => {
        try {
            const user = await this.userService.signUp(req.body);
            res.status(201).json({
                success: true,
                data: user,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    signIn = async (req: Request<{}, {}, SignInRequest>, res: Response<Web<SignInResponse>>) => {
        try {
            const user = await this.userService.signIn(req.body);
            res.status(201).json({
                success: true,
                data: user,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    getUser = async (req: Request<{}, {}, SignInRequest>, res: Response<Web<any>>) => {
        try {
            if (!req.userId) throw new Unathorized('Not allowed');
            const user = await this.userService.getUser(req.userId);
            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorization = req.headers['authorization'];
            console.log('hasil ' + authorization);
            if (typeof authorization !== 'string') throw new Forbidden("You don't have authorization");
            
            // The format of this header is:
            // Bearer requested_token
            const token = authorization.split(' ')[1];
            if (!token) throw new Unathorized('Token format is invalid');

            const userId = this.userService.verify(token);
            req.userId = userId;
        } catch (error) {
            return GeneralError.handle(error, res);
        }

        return next();
    };
}

export default UserController;