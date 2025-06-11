import { ApiProperty } from '@nestjs/swagger';

export class WelcomeResponse {
  @ApiProperty({ example: 'Welcome to the API' })
  message: string;

  @ApiProperty({
    example:
      'This API provides endpoints for authentication and blog management.',
  })
  description: string;

  @ApiProperty({ example: 'https://blog-management-ss4f.onrender.com/docs' })
  docs: string;

  @ApiProperty({ example: 'Shahadath Hossen Sajib' })
  author: string;

  @ApiProperty({ example: '2025-05-27T12:00:00.000Z' })
  timestamp: string;
}
