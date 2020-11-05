import {Controller, Request, Post, UseGuards, Get, Patch} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import {LocalAuthGuard} from "./auth/guards/local-auth.guard";
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {UsersService} from './users/users.service';


@Controller()
export class AppController {
  getHello(): any {
      throw new Error("Method not implemented.");
  }
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('/profile/mutation/email')
  changeEmail(@Request() req) {
    const {body, user} = req;
    return this.usersService.changeEmail(body.email, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile/mutation/password')
  changePassword(@Request() req) {
    const {body, user} = req;
    return this.usersService.changePassword(body.password, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile/mutation/name')
  changeName(@Request() req) {
    const {body, user} = req;

    return this.usersService.changeName(body.full_name, user);
  }
}
