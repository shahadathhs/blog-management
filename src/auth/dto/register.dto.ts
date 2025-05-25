import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password (minimum 6 characters)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'abc123token',
    description: 'Optional email verification token',
  })
  @IsOptional()
  verificationToken?: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  name: string;
}
