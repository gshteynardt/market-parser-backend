import {UsersService} from "../users/services/users.service";
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string, full_name: string): Promise<User> {

      const user = await this.usersService.findOne(email);
      if (!user) {
        return null;
      }
      const result = await bcrypt.compare(pass, user.password);
      if (result) {
        return user;
      }
      return null;
    }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, name: user.full_name};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}