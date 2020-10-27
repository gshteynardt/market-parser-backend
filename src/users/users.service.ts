import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

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

  async findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({email});
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

}