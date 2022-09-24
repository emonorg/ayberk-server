import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  async health() {
    return {
      status: 'OK',
      startTime: this.appService.startTime,
      version: this.appService.AYBERK_VERSION,
    };
  }
}
