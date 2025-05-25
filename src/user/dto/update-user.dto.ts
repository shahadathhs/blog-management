import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserEnum } from 'src/common/enum/user.enum';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(UserEnum)
  roles: UserEnum;

  @IsBoolean()
  isActive: boolean;
}
