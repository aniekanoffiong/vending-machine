import { IsString } from 'class-validator';

class UpdateUserDto {
    @IsString()
    public username: string;
}

export default UpdateUserDto;