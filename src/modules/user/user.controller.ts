import { Request, Response, NextFunction } from 'express';
import userService from "../user/user.service";
import { User as UserEntity } from './user.entity';
import RequestWithUser from 'src/interfaces/userRequest.interface';
import RequestParams from '../common/product.request';
import UpdateUserDto from './dto/userUpdate.dto';
import User, { UserWithoutPassword } from './user.interface';

const UserController = {
    all: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User|undefined = req.user;
            console.log(`GET :: retrieveing all users information for logged in user ${user}`);
            const users: UserEntity[] = await userService.all();
            res.send(UserController.filterPasswordList(users));
        } catch (error) {
            next(error);
        }
    },

    get: async function(req: Request<RequestParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as number;
            const user: UserEntity = await userService.get(id);
            res.send(UserController.filterPassword(user))
        } catch (error) {
            next(error);
        }
    },

    put: async function(req: Request<RequestParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as number;
            const userUpdateDto: UpdateUserDto = req.body;
            const result: boolean = await userService.update(id, userUpdateDto);
            res.send({ message: result ? `User with id ${id} has been successfully updated` : `Unable to update user with id ${id}`})
        } catch (error) {
            next(error);
        }
    },

    delete: async function(req: Request<RequestParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as number;
            const result: boolean = await userService.delete(id);
            res.send({ message: result ? `User with id ${id} has been successfully deleted` : `Unable to delete user with id ${id}`})
        } catch (error) {
            next(error);
        }
    },

    filterPasswordList: function(users: UserEntity[]): UserWithoutPassword[] {
        return users.map(UserController.filterPassword)
    },

    filterPassword: function(user: UserEntity): UserWithoutPassword {
        const { password, ...rest } = user;
        return rest as UserWithoutPassword
    }
}

export default UserController;