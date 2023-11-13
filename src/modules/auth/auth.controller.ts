import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import WrongCredentialsException from "../../exceptions/incorrectCredentials.exception";
import CreateUserDto from "../user/dto/userCreate.dto";
import UserRepository from "../user/user.repository";
import authService from "./auth.service";
import AuthDto from "./auth.dto";
import RequestWithUser from "src/interfaces/userRequest.interface";
import User from "../user/user.interface";

const AuthController = {
    register: async (request: Request, response: Response, next: NextFunction) => {
        const userData: CreateUserDto = request.body;
        const { password, ...rest } = userData;
        console.log(`attempting to create user with data ${JSON.stringify(rest)}`);
        try {
            const { cookie, data } = await authService.register(userData);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(data);
        } catch (error) {
            next(error);
        }
    },

    login: async function(request: Request, response: Response, next: NextFunction) {
        const logInData: AuthDto = request.body;
        const user = await UserRepository.findOneBy({ username: logInData.username });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.password,
            );
            if (isPasswordMatching) {
                const tokenData = authService.createToken(user);
                let activeLoginData: { activeLogin?: boolean } = {};
                response.setHeader('Set-Cookie', [authService.createCookie(tokenData)]);
                if (await authService.existingLoginForUser(user)) {
                    activeLoginData.activeLogin = true;
                }
                await authService.createLoginData(user, tokenData);
                const { password, ...data } = user;
                response.send({ ...data, ...activeLoginData });
            } else {
                next(new WrongCredentialsException());
            }
        } else {
        next(new WrongCredentialsException());
        }
    },

    logout: (_req: Request, res: Response) => {
        authService.logout(res);
        res.status(200);
        res.send({ message: "Account has been logged out "});
    },

    logoutAll: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User|undefined = req.user;
            const authUuid: string|undefined = req.authUuid;
            console.log(`POST :: terminating all active sessions for use ${user?.id}`);
            const result: boolean = await authService.resetAllLogin(authUuid, user);
            res.send({ message: result ? "All other sessions successfully terminated" : "Failed to terminate sessions"});
        } catch (error) {
            next(error);
        }
    },
}

export default AuthController;