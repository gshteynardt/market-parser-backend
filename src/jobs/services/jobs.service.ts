import { HttpStatus, Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map } from 'rxjs/operators';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { coreApiService } from '../../coreApi/services/coreApi.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

const XLSX = require('xlsx');
const fs = require('fs');

export interface IJobData {
  id: number;
  entriesProcessed?: number;
  launched?: number;
  status?: string;
  created: number;
  title: string;
  totalRows?: number
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private userService: UsersService,
    private coreApiService: coreApiService,
  ) {}

  async compareUserJob(id: number, jobId) {
    const currentUser = await this.userService.findOneById(id);
    if (id) {
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

  async addJob(id: number, title: string) {
    const user = await this.userService.findOneById(id);
    if (user) {
      const job = this.jobsRepository.create({
        author: user,
        createdAt: new Date().getTime(),
        title: title,
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

  async stopJob(id: number, idUser: number){
    const job: Job = await this.compareUserJob(idUser, id);
    this.coreApiService.stopJob(job.jobUUID)
  }

  async startJob(id: number, idUser: number){
    const job: Job = await this.compareUserJob(idUser, id);
    this.coreApiService.startJob(job.jobUUID)
  }

  async createCoreJob(totalRows: number, file: any, id: number, user: User) {
    const nameWorker = 'preview_worker';
    const jobID = await this.coreApiService.addNewJob(nameWorker, file);
    // временная джоба
    // const jobID = '1604501042728_0x7954176052416189';
    fs.writeFile(`./data/import_${jobID}.xlsx`, file.buffer, () => {});
    const job: Job|boolean = await this.compareUserJob(user.id, id);

    if (job){
      job.jobUUID = jobID;
      job.totalRows = totalRows;
    }
    return this.jobsRepository
    .save(job as Job)
    .then(res=>res)
  }

  async getJobData(id: number, idUser: number) {
    const job: Job = await this.compareUserJob(idUser, id);
    let fileData: string;
    try {
      fileData = fs.readFileSync(`./data/import_${job.jobUUID}.xlsx`, 'utf8');
    } catch (err) {
      return { message: "Couldn't find/read the requested file." };
    }
    return { data: fileData };
  }


  async getJobStatus(id: number, idUser: number) {
    const {
      createdAt,
      id: jobId,
      jobUUID,
      title,
      totalRows
    }: Job = await this.compareUserJob(idUser, id);
    if (jobUUID) {
      return this.coreApiService.getStatus(jobUUID).pipe(
        map(({ data }) => {
          return {
            id: jobId,
            totalRows: totalRows,
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

  async getJobResult(id: number, idUser: number) {
    const job: Job = await this.compareUserJob(idUser, id);
    return this.coreApiService
      .getStatus(job.jobUUID)
      .toPromise()
      .then(res => {
        if (res.data.status === 'finished') {
          return this.coreApiService.getResult(job.jobUUID).pipe(
            map(res => {
              fs.writeFile(`./data/${job.jobUUID}.csv`, res.data, () => {});
              return { data: res.data, type: "Complete" };
            }),
          );
        } else return this.getEmptyJobResult(job.jobUUID);
      });
  }

  async getOldJobResult(id: number, idUser: number) {
    const job: Job = await this.compareUserJob(idUser, id);
    let fileData: string;
    try {
      fileData = fs.readFileSync(`./data/${job.jobUUID}.csv`, 'utf8');
    } catch (err) {
      return { message: "Couldn't find/read the requested file." };
    }
    return { data: fileData };
  }

  getEmptyJobResult(jobUUID: string){
    let fileData;
    try {
      /*fileData = fs.readFileSync(`./data/import_${jobUUID}.xlsx`, 'utf8');*/
      const wb = XLSX.readFile(`./data/import_${jobUUID}.xlsx`, {type: 'file'});
      fileData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1});
    } catch (err) {
      console.log(err);
      return { message: "Couldn't find/read the requested file." };
    }
    return { data: fileData, type: "In progress" };
  }

  async deleteJob(id: number, idUser: number) {
    const job: Job = await this.compareUserJob(idUser, id);
    if (job) {
      await this.jobsRepository
        .delete(job)
        .then(res => res)
        .catch(err => err);
    } else return { message: 'Job not found' };
  }

  async getAllJobs(idUser: number) {
    const currentUser: User = await this.userService.findOneById(idUser);
    const jobsArray: Job[] = await this.jobsRepository.find({
      author: currentUser,
    });
    const result: IJobData[] = [];
    for (const elem of jobsArray) {
      if (elem.jobUUID) {
        await this.coreApiService
          .getStatus(elem.jobUUID)
          .toPromise()
          .then(({ data }) => {
            result.push({
              id: elem.id,
              title: elem.title,
              entriesProcessed: data.entriesProcessed,
              created: elem.createdAt,
              launched: data.createdAt,
              status: data.status,
              totalRows: elem.totalRows
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
