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
}
