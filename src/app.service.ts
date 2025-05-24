import { Injectable } from '@nestjs/common';
import { WelcomeResponse } from './interface/global.interface';

@Injectable()
export class AppService {
  getWelcome(): WelcomeResponse {
    return {
      message: '👋 Welcome to the Blog Management API!',
      description: 'This is the backend service for our application.',
      docs: 'Visit /api for Swagger API documentation.',
      author: 'https://github.com/shahadathhs',
      timestamp: new Date().toISOString(),
    };
  }
}
