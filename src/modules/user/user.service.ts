import UpdateUserDto from "./dto/userUpdate.dto";
import { User as UserEntity } from "./user.entity";
import userRepository from "./user.repository";

const UserService = {
    all: async function(): Promise<UserEntity[]> {
        const users: UserEntity[] = await userRepository.find();
        return users;
    },

    get: async function(id: number): Promise<UserEntity> {
        const user: UserEntity = await userRepository.findOneByOrFail({ id })
        return user;
    },

    update: async function(id: number, productUpdateData: UpdateUserDto): Promise<boolean> {
        const { username } = productUpdateData;
        const result = await userRepository.update({ id }, { username })
        console.log(`Checking affected rows for update query ${result.affected}`)
        return result.affected ? result.affected > 0 : false;
    },

    delete: async function(id: number): Promise<boolean> {
        const result = await userRepository.delete({ id })
        console.log(`Checking affected rows for delete query ${result.affected}`)
        return result.affected ? result.affected > 0 : false;
    },

}

export default UserService;