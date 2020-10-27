import {Controller, Post, Body, Request, UseGuards, Get, Param, Delete} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) { }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }

  @Post('create')
  async create(@Body() user: User) {
    const return_user = await this.service.createUser(user);
    return {
      email: return_user.email,
      full_name: return_user.full_name,
    }
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Get(':email')
  find(@Param('email') email: string): Promise<User> {
    return this.service.findOne(email);
  }

  @Delete(':id')
  remove(@Param('id', ) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
