import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WelcomeResponse } from '@project/common/dto/welcome-response.dto';
import { AppService } from './app.service';

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
    console.info(`[HEALTH] Ping received at ${new Date().toISOString()}`);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
