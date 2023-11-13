import { Optional } from 'utility-types';

type User = {
    id: number;
    username: string;
    password?: string;
    deposit: number;
    role: string;
}

type UserWithoutPassword = Optional<User, 'password'>;

export default User;
export { UserWithoutPassword }