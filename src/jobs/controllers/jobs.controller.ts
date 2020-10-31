import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  addJob(@Request() req) {
    return this.jobsService.addJob(req.user.email, req.body.title);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllJobs(@Request() req) {
    return await this.jobsService.getAllJobs(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/status')
  getJobStatus(@Param() params, @Request() req) {
    return this.jobsService.getJobStatus(parseInt(params.id), req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/result/old')
  getJob(@Param() params, @Request() req) {
    return this.jobsService.getJobResult(params.id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/result/new')
  getOldJob(@Param() params, @Request() req) {
    return this.jobsService.getOldJobResult(params.id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/remove')
  deleteJob(@Param() params, @Request() req) {
    return this.jobsService.deleteJob(params.id, req.user.email);
  }
}
