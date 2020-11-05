import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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

  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Get(':email')
  find(@Param('email') email: string): Promise<User> {
    return this.service.findOne(email);
  }

  /*@UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrent(@Request() req){
    return this.service.getCurrent(req.user.email)
  }*/

  // @Delete(':id')
  // remove(@Param('id', ) id: string): Promise<void> {
  //   return this.service.remove(id);
  // }
}
