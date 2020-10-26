import {UsersService} from "../users/users.service";
import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {
    }

    async validateUser(email: string, pass: string): Promise<any> {

        await this.usersService.findOne(email)
            .then( user => {
                if (!user) {
                    return Promise.reject(new Error('Неправильные почта и пароль'))
                }
                bcrypt.compare(pass, user.password)
                    .then( matched => {
                        if (!matched) {
                            return Promise.reject(new Error('Неправильные почта и пароль'))
                        }
                        return user;
                    })
                return null;
            })
    }
}