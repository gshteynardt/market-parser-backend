import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('create')
  async create(@Body() user: User) {
    const return_user = await this.service.createUser(user);
    return {
      email: return_user.email,
      full_name: return_user.full_name,
    };
  }

  @Get(':email')
  find(@Param('email') email: string): Promise<User> {
    return this.service.findOne(email);
  }

}
