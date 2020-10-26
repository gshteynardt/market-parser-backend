import {  Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.usersService.createUser(request.body, response);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<User> {
  //   return this.usersService.findOneById(id);
  // }

  @Get(':email')
  find(@Param('email') email: string): Promise<User> {
    return this.usersService.findOne(email);
  }

  @Delete(':id')
  remove(@Param('id', ) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
