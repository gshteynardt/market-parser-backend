import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/add')
  addUser(){
    return this.usersService.addUser()
  }

  @Get('/all')
  getAll(){
    return this.usersService.getAll()
  }
}
