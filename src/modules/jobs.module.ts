import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { JobsService } from '../services/jobs.service';
import { JobsController } from '../controllers/jobs.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), TypeOrmModule.forFeature([User])],
  providers: [JobsService, UsersService],
  controllers: [JobsController],
  exports: [JobsService]
})
export class JobsModule {}