import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @ApiProperty({
    example: 'resetToken123',
    description: 'Token received for password reset',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newStrongPassword456',
    description: 'New password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
