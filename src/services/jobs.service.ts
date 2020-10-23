import { Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job)
              private jobsRepository: Repository<Job>) {}
}