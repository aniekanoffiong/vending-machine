import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import UserWithEmailExistsException from "../user/exception/userWithEmailExist.exception";
import DataStoredInToken from "../../interfaces/dataFromToken.interface";
import TokenData from "../../interfaces/tokenData.interface";
import CreateUserDto from "../user/dto/userCreate.dto";
import { User as UserEntity } from "../user/user.entity";
import userRepository from "../user/user.repository";
import { Response } from "express";
import { ActiveLogin } from "./auth.entity";
import authRepository from "./auth.repository";
import { Not } from "typeorm";
import User from "../user/user.interface";
import Role from "../../types/role.enum";

const AuthenticationService = {
    register: async function(userData: CreateUserDto) {
        if (await userRepository.findOneBy({ username: userData.username })) {
            console.log(`user with username '${userData.username}' already exists`);
            throw new UserWithEmailExistsException(userData.username);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        let { password, ...rest } = userData;
        console.log(`creating user with details ${JSON.stringify(rest)}`);
        const user = userRepository.create({
            ...userData,
            password: hashedPassword,
            role: userData.role || Role.BUYER,
            deposit: 0
        });
        await userRepository.save(user);
        let { password: hashed, ...data } = user;
        console.log(`result after attempting to create user ${JSON.stringify(data)}`);
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            data,
        };
    },

    createCookie: (tokenData: TokenData) => {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    },

    createToken: (user: UserEntity): TokenData => {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET as string;
        const uuid = uuidv4()
        const dataStoredInToken: DataStoredInToken = {
            _id: user.id,
            uuid
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
            uuid
        };
    },

    logout: function(res: Response) {
        res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    },

    existingLoginForUser: async function(user: UserEntity): Promise<boolean> {
        const activeLogin: ActiveLogin[]|null = await authRepository.findBy({ userId: user.id, isActive: true });
        console.log(`Checking for existing login for user ${user.id} returned ${JSON.stringify(activeLogin)}`);
        return activeLogin?.length > 0;
    },

    createLoginData: async function(user: UserEntity, tokenData: TokenData) {
        const loginData: ActiveLogin = authRepository.create({ 
            userId: user.id,
            uuid: tokenData.uuid,
            isActive: true 
        });
        await authRepository.save(loginData);
    },

    resetAllLogin: async function(uuidString?: string, user?: User): Promise<boolean> {
        const result = await authRepository.update({ userId: user?.id, uuid: Not(uuidString as string), isActive: true }, { isActive: false })
        console.log(`Resetting all login for user ${user?.id} except login uuid ${uuidString} returned ${result.affected}`)
        return result.affected ? result.affected > 0 : false;
    }
}

export default AuthenticationService;