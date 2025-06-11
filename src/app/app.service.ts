import { Injectable } from '@nestjs/common';
import { WelcomeResponse } from '@project/common/dto/welcome-response.dto';

@Injectable()
export class AppService {
  getWelcome(): WelcomeResponse {
    return {
      message: '👋 Welcome to the Blog Management API!',
      description: 'This is the backend service for our application.',
      docs: 'Visit /docs for Swagger API documentation.',
      author: 'https://github.com/shahadathhs',
      timestamp: new Date().toISOString(),
    };
  }
}
