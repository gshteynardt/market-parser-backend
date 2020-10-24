import { Controller, Get, Post } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';

@Controller('/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('/add-job')
  addJob(){
    return this.jobsService.addJob()
  }
}
