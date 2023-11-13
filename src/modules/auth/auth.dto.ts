import { IsString } from 'class-validator';

class AuthDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}

export default AuthDto;