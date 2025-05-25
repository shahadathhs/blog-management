import { IsString, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
