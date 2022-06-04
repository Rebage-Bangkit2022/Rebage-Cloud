import express, { Router } from "express";
import UserService from "../service/user-service";
import { Request, Response } from "express";
import {
  AuthGoogleRequest,
  EditUserRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "../model/user";
import Web from "src/model/web";
import GeneralError, { Unathorized } from "../model/error";
import { auth } from "./middleware";

class UserController {
  userService: UserService;
  router: Router;

  constructor(userService: UserService, router?: Router) {
    this.userService = userService;
    const r = router ?? express.Router();
    this.router = r;

    r.post("/api/user/signup", this.signUp);
    r.post("/api/user/signin", this.signIn);
    r.get("/api/user", auth, this.getUser);
    r.post("/api/user/auth-google", this.authGoogle);
    r.put("/api/user/edit", auth, this.editUser);
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
      if (!req.userId) throw new Unathorized("Not allowed");
      const user = await this.userService.getUser(req.userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      GeneralError.handle(error, res);
    }
  };

  authGoogle = async (req: Request<{}, {}, AuthGoogleRequest>, res: Response<Web<SignInResponse>>) => {
    try {
      const user = await this.userService.authGoogle(req.body);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      GeneralError.handle(error, res);
    }
  };

  editUser = async (req: Request<{}, {}, EditUserRequest>, res: Response<Web<any>>) => {
    try {
      if (!req.userId) throw new Unathorized("Not allowed");
      const user = await this.userService.editUser(req.userId, req.body);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      GeneralError.handle(error, res);
    }
  };
}

export default UserController;
