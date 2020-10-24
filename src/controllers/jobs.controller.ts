import { Controller, Get, Post, Req } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import {Request} from 'express';

@Controller('/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /*@Post('/add-job')
  addJob(){
    return this.jobsService.addJob( )
  }*/

  @Post('/getNewJobResult')
  getJob(@Req() request: Request) {
    return this.jobsService.getJobResult(request.body.id);
  }

  @Post('/getOldJobResult')
  getOldJob(@Req() request: Request) {
    console.log(request.headers);
    return this.jobsService.getOldJobResult(request.body.id);
  }
}
