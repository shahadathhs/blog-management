import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum } from 'class-validator';
import { UserEnum } from 'src/common/enum/user.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(UserEnum)
  roles: UserEnum;

  @IsBoolean()
  isActive: boolean;
}
