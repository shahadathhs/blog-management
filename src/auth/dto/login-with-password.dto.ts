import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginWithPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
