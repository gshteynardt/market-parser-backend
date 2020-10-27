import {UsersService} from "../users/users.service";
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {

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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}