import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(body, response): Promise<void>{
    const {nickname, firstName, lastName, email, password} = body;
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds)
        .then(hash => {
          const user = this.usersRepository.create({
            nickName: nickname,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
          })
          return user;
        })
        .then( user => {
          this.usersRepository.save(user)
              .then(user => response.send(user))
              .catch(err => response.status(400).send(err.message));
            }
        )
        .catch(err => {
          response.status(500)
          console.log(err)
        })
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}