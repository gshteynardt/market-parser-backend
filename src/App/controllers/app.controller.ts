import {
  Controller,
  Request,
  Response,
  Post,
  Patch,
  UseGuards,
  Get,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../../users/services/users.service';


@Controller()
export class AppController {

  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService,
  ) {}

  @Post('/getError')
  sendError(): string {
    return 'Error';
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const id  = req.id;
    return this.usersService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile/email')
  changeEmail(@Request() req) {
    const {body, user} = req;
    return this.usersService.changeEmail(body.email, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile/password')
  changePassword(@Request() req) {
    const {body, user} = req;
    return this.usersService.changePassword(body.password, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile/name')
  changeName(@Request() req) {
    const {body, user} = req;
    return this.usersService.changeName(body.full_name, user);
  }
}
