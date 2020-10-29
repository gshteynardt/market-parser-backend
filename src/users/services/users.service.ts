import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addUser() {
    const user = this.usersRepository.create({
      firstName: 'testName',
      lastName: 'testSurname',
      email: 'test2@gmail.com',
      password: 'password',
      jobs: [],
    });
    this.usersRepository.save(user).then((res) => console.log(res));
  }

  getUserById(id: number) {
    return this.usersRepository.findOne({ id: id });
  }

  getAll() {
    return this.usersRepository.find();
  }

  /*updateUsersJobs(user, job){
    if (!user.jobs){
      user.jobs = []
    }
    user.jobs.push(job)
    console.log(user)
    return this.usersRepository.save(user)
  }*/
}
