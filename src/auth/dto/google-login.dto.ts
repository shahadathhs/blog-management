import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ description: 'ID token from Google Sign-In' })
  token: string;
}
