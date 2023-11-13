import { IsString } from 'class-validator';
import Role from "../../../types/role.enum";

class CreateUserDto {
    @IsString()
    public username: string;

    @IsString()
    public password: string;

    @IsString()
    public role: Role;

}

export default CreateUserDto;