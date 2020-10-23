import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { UsersService } from '../services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
