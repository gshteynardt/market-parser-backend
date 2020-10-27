import {Controller, Request, Post, UseGuards, Get} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import {LocalAuthGuard} from "../auth/local-auth.guard";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('/getError')
  sendError(): string{
    return 'Error'
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

}
