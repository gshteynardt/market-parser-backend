import {UsersService} from "../users/users.service";
import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {
    }

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
}