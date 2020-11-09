import {
  Controller,
  Delete,
  Get,
  Param,
  Post, Query,
  Request, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  addJob(@Request() req) {
    return this.jobsService.addJob(req.user.email, req.body.title);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/create/core')
  @UseInterceptors(FileInterceptor('file'))
  async uploadedFile(@UploadedFile() file, @Query() query, @Request() request, @Param() params) {
    return this.jobsService.createCoreJob(query.totalRows, file, params.id ,request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/get/data')
  async getData(@Param() params, @Request() req) {
    return await this.jobsService.getJobData(params.id, req.user.email)
  }


  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllJobs(@Request() req) {
    return await this.jobsService.getAllJobs(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/stop')
  async stopJob(@Param() params, @Request() req) {
    return this.jobsService.stopJob(parseInt(params.id), req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/start')
  async startJob(@Param() params, @Request() req) {
    return this.jobsService.startJob(parseInt(params.id), req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/status')
  getJobStatus(@Param() params, @Request() req) {
    return this.jobsService.getJobStatus(parseInt(params.id), req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/result/new')
  getJob(@Param() params, @Request() req) {
    return this.jobsService.getJobResult(params.id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/result/old')
  getOldJob(@Param() params, @Request() req) {
    return this.jobsService.getOldJobResult(params.id, req.user.email);
  }

  /*@UseGuards(JwtAuthGuard)
  @Get('/:id/result/empy')
  getEmptyJob(@Param() params, @Request() req) {
    return this.jobsService.getEmptyJobResult(params.id, req.user.email);
  }*/

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/remove')
  deleteJob(@Param() params, @Request() req) {
    return this.jobsService.deleteJob(params.id, req.user.email);
  }
}
