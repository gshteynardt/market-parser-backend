import {Controller, Request, Post, UseGuards, Get, Patch} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import {LocalAuthGuard} from "../../auth/guards/local-auth.guard";
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';


@Controller()
export class AppController {
  getHello(): any {
      throw new Error("Method not implemented.");
  }
  constructor(private readonly authService: AuthService) {}

  @Post('/getError')
  sendError(): string{
    return 'Error'
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
