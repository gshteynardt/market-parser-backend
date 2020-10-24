import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobsService } from './jobs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    ) {}

  async addUser(){
    const user = this.usersRepository.create({
      firstName: 'testName',
      lastName: 'testSurname',
      email: 'test@gmail.com',
      password: 'password',
      jobs: []
    })
    this.usersRepository.save(user).then(res=>console.log(res));
  }

  getUserById(id: number){
    return this.usersRepository.findOne({id: id})
  }

  getAll(){
    return this.usersRepository.find()
  }
}