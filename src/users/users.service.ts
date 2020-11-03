import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import { User } from './user.entity';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
  ) {}

    async createUser(user: User) {

        // Проверка, что пользователь с такой почтой не существует
        const {email} = user;
        const query_user = await this.findOne(email);
        if (query_user) {
            const errors = {username: 'email must be unique.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        const newUser = new User();
        newUser.full_name = user.full_name;
        newUser.email = user.email;
        newUser.password = user.password;
        const errors = await validate(newUser);
        if (errors.length > 0) {
            // Таким образом возвращается ошибку, если email не подходит под "шаблон"
            const _errors = {username: 'fields are invalid'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.usersRepository.save(newUser);
            return savedUser;
        }
    }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({email});
  }

  async updateEmail(user: User, email: string): Promise<UpdateResult> {
    return this.usersRepository.update(user.id, {email: email});
  }

  async updatePassword(user: User, password: string): Promise<UpdateResult> {
    return this.usersRepository.update(user.id, {password: password});
  }

  async updateName(user: User, full_name: string): Promise<UpdateResult> {
    return this.usersRepository.update(user.id, {full_name: full_name});
  }

  async changeEmail(inputEmail: string, inputUser: User) {
    const query_user = await this.findOne(inputEmail);

    if (query_user) {
      const errors = {username: 'email must be unique'}
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    } else {
      await this.updateEmail(inputUser, inputEmail);
      return inputEmail;
    }
  }

  async changePassword(password: string, inputUser: User) {
    const id  = inputUser.id;
    const query_user = await this.findOneById(id);

    if (query_user) {
      bcrypt.hash(password, saltRounds)
        .then( hash => this.updatePassword(inputUser, hash))
        .then( () => new HttpException({message: 'Password changed successfully'}, HttpStatus.CREATED))
        .catch(err => err.message)
    } else {
      new HttpException({message: 'Password not changed'}, HttpStatus.BAD_REQUEST);
    }
  }

  async changeName(full_name: string, inputUser: User) {
    const id  = inputUser.id;
    const query_user = await this.findOneById(id);

    if (query_user) {
      await this.updateName(inputUser, full_name);
      return full_name;
    } else {
      new HttpException({message: 'Name not changed'}, HttpStatus.BAD_REQUEST);
    }
  }
}