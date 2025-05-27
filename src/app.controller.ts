import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { WelcomeResponse } from './common/dto/welcome-response.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns a welcome message',
    type: WelcomeResponse,
  })
  getWelcome(): WelcomeResponse {
    return this.appService.getWelcome();
  }

  @Get('health')
  @ApiOkResponse({
    description: 'Returns service health status',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-05-27T12:00:00.000Z',
      },
    },
  })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
