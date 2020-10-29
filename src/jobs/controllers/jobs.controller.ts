import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { Request } from 'express';

@Controller('/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('/create')
  addJob() {
    return this.jobsService.addJob();
  }

  @Get('/all')
  async getAllJobs() {
    return await this.jobsService.getAllJobs();
  }

  @Get('/:id/status')
  getJobStatus(@Param() params) {
    return this.jobsService.getJobStatus(parseInt(params.id));
  }

  @Get('/:id/result/old')
  getJob(@Param() params) {
    return this.jobsService.getJobResult(params.id);
  }

  @Get('/:id/result/new')
  getOldJob(@Param() params) {
    return this.jobsService.getOldJobResult(params.id);
  }

  @Post('/:id/remove')
  deleteJob(@Param() params) {
    return this.jobsService.deleteJob(params.id);
  }
}
