import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WelcomeResponse } from './common/interface/global.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcome(): WelcomeResponse {
    return this.appService.getWelcome();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
