import { Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private userService: UsersService) {}

  async getJobByJobUUID(uuid: string){
    return await this.jobsRepository.findOne({jobUUID: uuid})
  }

  async addJob(){
    const user = await this.userService.getUserById(3)
    const job = this.jobsRepository.create({
      jobUUID: '1603115662214_0x33946741255392743',
      isFinished: true,
      author: user
    })
    return this.jobsRepository.save(job)
      .then()
  }
}