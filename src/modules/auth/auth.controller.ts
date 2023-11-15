import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import WrongCredentialsException from "../../exceptions/incorrectCredentials.exception";
import CreateUserDto from "../user/dto/userCreate.dto";
import UserRepository from "../user/user.repository";
import authService from "./auth.service";
import AuthDto from "./auth.dto";
import RequestWithUser from "src/interfaces/userRequest.interface";
import User from "../user/user.interface";
import { User as UserEntity } from "../user/user.entity";
import TokenData from "src/interfaces/tokenData.interface";

const AuthController = {
    check: async function(req: RequestWithUser, res: Response, _next: NextFunction) {
        const user = req.user as UserEntity;
        const authUuid = req.authUuid as string;
        res.send(await AuthController.sendResponse(user, null, authUuid));
    },

    register: async (req: Request, res: Response, next: NextFunction) => {
        const userData: CreateUserDto = req.body;
        const { password, ...rest } = userData;
        console.log(`attempting to create user with data ${JSON.stringify(rest)}`);
        try {
            const { cookie, data } = await authService.register(userData);
            res.setHeader('Set-Cookie', [cookie]);
            res.send(data);
        } catch (error) {
            next(error);
        }
    },

    login: async function(req: Request, res: Response, next: NextFunction) {
        const logInData: AuthDto = req.body;
        const user = await UserRepository.findOneBy({ username: logInData.username });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.password,
            );
            if (isPasswordMatching) {
                const tokenData = authService.createToken(user);
                res.setHeader('Set-Cookie', [authService.createCookie(tokenData)]);
                res.send(await AuthController.sendResponse(user, tokenData, tokenData.uuid))
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    },

    sendResponse: async function(user: UserEntity, tokenData: TokenData|null, authUuid: string) {
        let activeLoginData: { activeLogin?: boolean } = {};
        if (await authService.existingLoginForUser(user, authUuid)) {
            activeLoginData.activeLogin = true;
        }
        if (tokenData) {
            await authService.createLoginData(user, tokenData);
        }
        const { password, ...data } = user;
        console.log(`checking data for sendResponse data ${JSON.stringify(data)} and activeLoginData ${JSON.stringify(activeLoginData)}`);
        return { ...data, ...activeLoginData };
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