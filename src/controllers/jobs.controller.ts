import { Controller, Get, Post, Req } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import {Request} from 'express';

@Controller('/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('/add-job')
  addJob(){
    return this.jobsService.addJob( )
  }

  @Get('/getAllJobs')
  async getAllJobs() {
    return await this.jobsService.getAllJobs()
  }

  @Post('/getJobStatus')
  getJobStatus(@Req() request: Request){
    return this.jobsService.getJobStatus(request.body.id)
  }

  @Post('/getNewJobResult')
  getJob(@Req() request: Request) {
    return this.jobsService.getJobResult(request.body.id);
  }

  @Post('/getOldJobResult')
  getOldJob(@Req() request: Request) {
    return this.jobsService.getOldJobResult(request.body.id);
  }

  @Post('/deleteJob')
  deleteJob(@Req() request: Request){
    return this.jobsService.deleteJob(request.body.id);
  }
}