import { ApiProperty } from '@nestjs/swagger';
import { IsSixDigitCode } from '@project/common/validator/is-six-digit-code.validator';
import { IsEmail } from 'class-validator';

export class EmailLoginVerifyDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Login Code (6 digits)',
  })
  @IsSixDigitCode({ message: 'Code must be exactly 6 digits' })
  code: number | string;
}
