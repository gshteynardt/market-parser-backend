import { Controller, Get, Post } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
}
