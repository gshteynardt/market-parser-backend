import { HttpStatus, Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map } from 'rxjs/operators';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { coreApiService } from '../../coreApi/services/coreApi.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

const fs = require('fs');

export interface IJobData {
  id: number;
  entriesProcessed?: number;
  launched?: number;
  status?: string;
  created: number;
  title: string;
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private userService: UsersService,
    private coreApiService: coreApiService,
  ) {}

  async compareUserJob(email, jobId) {
    const currentUser = await this.userService.findOne(email);
    if (email) {
      const job: Job = await this.jobsRepository.findOne({
        author: currentUser,
        id: jobId,
      });
      if (job) {
        return job;
      } else
        throw new HttpException(
          { message: 'Job not found' },
          HttpStatus.NOT_FOUND,
        );
    } else
      throw new HttpException(
        { message: 'Invalid user' },
        HttpStatus.UNAUTHORIZED,
      );
  }

  async addJob(email: string, title: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      const job = this.jobsRepository.create({
        author: user,
        createdAt: new Date().getTime(),
        title: title,
        /*jobUUID: '1603115662214_0x33946741255392743'*/
      });
      return this.jobsRepository
        .save(job)
        .then(res => {
          return {
            title: res.title,
            createdAt: res.createdAt,
            id: res.id,
          };
        })
        .catch(err => err);
    } else
      throw new HttpException(
        { message: 'Invalid user' },
        HttpStatus.UNAUTHORIZED,
      );
  }

  async createCoreJob(file, id: number, user) {
    const nameWorker = 'defaultWorker';
    const jobID = await this.coreApiService.addNewJob(nameWorker, file);
    console.log(jobID);
    const currentUser = await this.userService.findOne(user.email);
    const job: Job|boolean = await this.compareUserJob(user, id);
    if (job){
      job.jobUUID = jobID;
    }
    return this.jobsRepository
    .save(job as Job)
    .then(res=>res)
  }


  async getJobStatus(id: number, email: string) {
    const {
      createdAt,
      id: jobId,
      jobUUID,
      title,
    }: Job = await this.compareUserJob(email, id);
    if (jobUUID) {
      return this.coreApiService.getStatus(jobUUID).pipe(
        map(({ data }) => {
          return {
            id: jobId,
            entriesProcessed: data.entriesProcessed,
            launched: data.createdAt,
            status: data.status,
            created: createdAt,
            title: title,
          };
        }),
      );
    } else
      return {
        id: jobId,
        launched: 0,
        created: createdAt,
        title: title,
      };
  }

  async getJobResult(id: number, email: string) {
    const job: Job = await this.compareUserJob(email, id);
    return this.coreApiService
      .getStatus(job.id)
      .toPromise()
      .then(res => {
        if (res.data.status === 'finished') {
          return this.coreApiService.getResult(job.jobUUID).pipe(
            map(res => {
              fs.writeFile(`./data/${job.jobUUID}.csv`, res.data, () => {});
              return { data: res.data };
            }),
          );
        } else return { status: 'Job in progress' };
      });
  }

  async getOldJobResult(id: number, email: string) {
    const job: Job = await this.compareUserJob(email, id);
    let fileData: string;
    try {
      fileData = fs.readFileSync(`./data/${job.jobUUID}.csv`, 'utf8');
    } catch (err) {
      return { message: "Couldn't find/read the requested file." };
    }
    return { data: fileData };
  }

  async deleteJob(id: number, email: string) {
    const job: Job = await this.compareUserJob(email, id);
    if (job) {
      await this.jobsRepository
        .delete(job)
        .then(res => res)
        .catch(err => err);
    } else return { message: 'Job not found' };
  }

  async getAllJobs(email: string) {
    const currentUser: User = await this.userService.findOne(email);
    const jobsArray: Job[] = await this.jobsRepository.find({
      author: currentUser,
    });
    const result: IJobData[] = [];
    for (const elem of jobsArray) {
      if (elem.jobUUID) {
        await this.coreApiService
          .getAll(currentUser, elem.jobUUID)
          .toPromise()
          .then(({ data }) => {
            result.push({
              id: elem.id,
              title: elem.title,
              entriesProcessed: data.entriesProcessed,
              created: elem.createdAt,
              launched: data.createdAt,
              status: data.status,
            });
          });
      } else
        result.push({
          id: elem.id,
          title: elem.title,
          created: elem.createdAt,
          launched: 0,
        });
    }
    return { jobs: result };
  }
}
