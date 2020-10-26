import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from '../services/app.service';
import {LocalAuthGuard} from "../auth/local-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/getError')
  sendError(): string{
    return 'Error'
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }

}
