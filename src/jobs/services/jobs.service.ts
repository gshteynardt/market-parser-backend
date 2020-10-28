import { HttpService, Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map } from 'rxjs/operators';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
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
    private httpService: HttpService,
  ) {}

  async getJobByJobUUID(uuid: string) {
    return await this.jobsRepository.findOne({ jobUUID: uuid });
  }

  async getJobByJobId(id: number) {
    return await this.jobsRepository.findOne({ id: id });
  }

  async addJob() {
    const user = await this.userService.getUserById(4);
    const job = this.jobsRepository.create({
      author: user,
      createdAt: new Date().getTime(),
      title: 'Empty job',
    });
    return this.jobsRepository
      .save(job)
      .then(/*()=>{
        this.userService.updateUsersJobs(user, job)
      }*/);
  }

  async getJobStatus(id: number) {
    const {
      createdAt,
      id: jobId,
      jobUUID,
      title,
    }: Job = await this.getJobByJobId(id);
    if (jobUUID !== 'unset') {
      return this.httpService
        .get(
          `http://159.89.51.65:8080/workers/old_defaultWorker/jobs/${jobUUID}`,
          {
            headers: {
              Authorization: 'Basic dXV1OmdnZzEyMw==',
            },
          },
        )
        .pipe(
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

  async getJobResult(id: number) {
    const job: Job = await this.getJobByJobId(id);
    return this.httpService
      .get(
        `http://159.89.51.65:8080/workers/old_defaultWorker/jobs/${job.jobUUID}`,
        {
          headers: {
            Authorization: 'Basic dXV1OmdnZzEyMw==',
          },
        },
      )
      .toPromise()
      .then((res) => {
        if (res.data.status === 'finished') {
          return this.httpService
            .get(`http://159.89.51.65:8080/${res.data.builtOutputFilePath}`, {
              headers: {
                Authorization: 'Basic dXV1OmdnZzEyMw==',
              },
            })
            .pipe(
              map((res) => {
                fs.writeFile(
                  `./data/${job.jobUUID}.csv`,
                  res.data,
                  (res) => {},
                );
                return { data: res.data };
              }),
            );
        } else return { status: 'Job in progress' };
      });
  }

  async getOldJobResult(id: number) {
    const job: Job = await this.getJobByJobId(id);
    let fileData: string;
    try {
      fileData = fs.readFileSync(`./data/${job.jobUUID}.csv`, 'utf8');
    } catch (err) {
      return { message: "Couldn't find/read the requested file." };
    }
    return { data: fileData };
  }

  async deleteJob(id: number) {
    const job: Job = await this.getJobByJobId(id);
    if (job) {
      await this.jobsRepository
        .delete(job)
        .then((res) => res)
        .catch((err) => err);
    } else return { message: 'Job not found' };
  }

  async getAllJobs() {
    const currentUser: User = await this.userService.getUserById(4);
    const jobsArray: Job[] = await this.jobsRepository.find({
      author: currentUser,
    });
    const result: IJobData[] = [];
    for (const elem of jobsArray) {
      if (elem.jobUUID !== 'unset') {
        await this.httpService
          .get(
            `http://159.89.51.65:8080/workers/old_defaultWorker/jobs/${elem.jobUUID}`,
            {
              headers: {
                Authorization: 'Basic dXV1OmdnZzEyMw==',
              },
            },
          )
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
