import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterWithPasswordDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}
