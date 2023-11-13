import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationFailedException from "../../exceptions/authenticationFailed.exception";
import AuthenticationRequiredException from "../../exceptions/authenticationRequired.exception";
import DataFromToken from "../../interfaces/dataFromToken.interface";
import RequestWithUser from "../../interfaces/userRequest.interface";
import userRepository from "../../modules/user/user.repository";
import User from "../user/user.interface";
import authRepository from "./auth.repository";
import { ActiveLogin } from "./auth.entity";
import authService from "./auth.service";

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET as string;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataFromToken;
      const id = verificationResponse._id;
      const uuid = verificationResponse.uuid;
      const user = await userRepository.findOneBy({ id }) as User;
      if (user) {
        const activeLogin: ActiveLogin|null = await authRepository.findOneBy({ userId: user.id, uuid });
        console.log(`Checking for activeLogin for user ${user.id} and uuid ${uuid} returned ${JSON.stringify(activeLogin)}`);
        if (activeLogin && !activeLogin.isActive) {
          authService.logout(res);
          res.status(200);
          res.send({ message: "Account has been logged out" });
        } else {
          req.user = user;
          req.authUuid = uuid;
          next();            
        }
      } else {
        next(new AuthenticationFailedException());
      }
    } catch (error) {
      next(new AuthenticationFailedException());
    }
  } else {
    next(new AuthenticationRequiredException());
  }
}

export default authMiddleware;