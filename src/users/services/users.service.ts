import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import { User } from '../entities/user.entity';
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
        const savedUser: User = await this.usersRepository.save(newUser);
        return savedUser;
    }
  }

  async findOneById(id: number) {
    try {
      const queryUser: User = await this.usersRepository.findOneOrFail(id);
      return queryUser;
    } catch (err) {
      throw new HttpException({message: 'User not found'}, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({email});
  }

  async updateEmail(inputId: number, email: string): Promise<UpdateResult> {
    return this.usersRepository.update(inputId, {email: email});
  }

  async updatePassword(inputId: number, password: string): Promise<UpdateResult> {
    return this.usersRepository.update(inputId, {password: password});
  }

  async updateCreateAd(inputId: number, dateNow: Date): Promise<UpdateResult> {
    return this.usersRepository.update(inputId, {createdAt: dateNow});
  }

  async updateName(id: number, full_name: string): Promise<UpdateResult> {
    return this.usersRepository.update(id, {full_name: full_name});
  }

  async changeEmail(inputEmail: string, inputId: number) {
    const id = inputId;
    const query_user = await this.findOne(inputEmail);

    if (query_user) {
      const errors = {username: 'email must be unique'}
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    } else {
      await this.updateEmail(id, inputEmail);
      return inputEmail;
    }
  }

  async changePassword(password: string, inputId: number) {
    const id  = inputId;
    const query_user = await this.findOneById(id);

    if (query_user) {
      try {
        bcrypt.hash(password, saltRounds)
          .then( hash => this.updatePassword(id, hash))
          .then( () => new HttpException({ message: 'Password changed successfully' }, HttpStatus.CREATED))
          .catch(err => err.message)
        const data = new Date();
        await this.updateCreateAd(id, data);
        return data;
      } catch (err) {
        new HttpException({message: 'Password not changed'}, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async changeName(full_name: string, inputId: number) {
    const id: number = inputId;
    const query_user = await this.findOneById(id);
    if (query_user) {
      await this.updateName(id, full_name);
      return full_name;
    } else {
      new HttpException({message: 'Name not changed'}, HttpStatus.BAD_REQUEST);
    }
  }
}