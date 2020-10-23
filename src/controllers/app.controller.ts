import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getJobs')
  getJobs() {
    return this.appService.getWorkerJobs();
  }

  @Post('/getError')
  sendError(): string{
    return 'Error'
  }
}
