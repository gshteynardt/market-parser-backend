import { HttpService, Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { map } from 'rxjs/operators';
import { User } from '../entities/user.entity';
const fs = require("fs");

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private userService: UsersService,
    private httpService: HttpService) {}

  async getJobByJobUUID(uuid: string){
    return await this.jobsRepository.findOne({jobUUID: uuid})
  }

  async getJobByJobId(id: number){
    return await this.jobsRepository.findOne({id: id})
  }

  async addJob(){
    const user = await this.userService.getUserById(4)
    const job = this.jobsRepository.create({
      jobUUID: '1603115662214_0x33946741255392743test2',
      author: user
    })
    return this.jobsRepository.save(job)
      .then(/*()=>{
        this.userService.updateUsersJobs(user, job)
      }*/)
  }

  csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if (',' === l && s) l = row[++i] = '';
      else if ('\n' === l && s) {
        if ('\r' === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [l = '']; i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  };

  async getJobStatus(id: number){
    const job: Job = await this.getJobByJobId(id);
    return this.httpService.get(`http://159.89.51.65:8080/workers/defaultWorker/jobs/${job.jobUUID}`, {
      headers: {
        'Authorization': 'Basic dXV1OmdnZzEyMw=='
      }
    }).pipe(map(res=>res.data))
  }

  async getJobResult(id: number) {
    const job: Job = await this.getJobByJobId(id);
    return this.httpService.get(`http://159.89.51.65:8080/workers/defaultWorker/jobs/${job.jobUUID}`, {
      headers: {
        'Authorization': 'Basic dXV1OmdnZzEyMw=='
      }
    }).toPromise()
      .then(res => {
        if (res.data.status === "finished"){
        return this.httpService.get(`http://159.89.51.65:8080/${res.data.builtOutputFilePath}`, {
          headers: {
            'Authorization': 'Basic dXV1OmdnZzEyMw=='
          }
        }).pipe(map(res => {
          fs.writeFile(`./data/${job.jobUUID}.csv`, res.data, (res)=>{})
          return { data: this.csvToArray(res.data) }
        }))}
        else return {status: 'Job in progress'}
      })

  }

  async getOldJobResult(id: number){
    const job: Job = await this.getJobByJobId(id);
    let fileData: string;
    try {
      fileData = fs.readFileSync(`./data/${job.jobUUID}.csv`, "utf8");
    }
    catch (err){
      return {message: "Couldn't find/read the requested file."}
    }
    return {data: this.csvToArray(fileData)}
  }

  async deleteJob(id: number){
    const job: Job = await this.getJobByJobId(id);
    if (job){
      await this.jobsRepository.delete(job)
        .then(res=>res)
        .catch(err=>err)
    }
    else return {message: 'Job not found'}
  }

  async getAllJobs(){
    const currentUser: User = await this.userService.getUserById(3);
    const jobsArray: Job[] = await this.jobsRepository.find({author: currentUser});
    return {jobs: jobsArray}
  }
}