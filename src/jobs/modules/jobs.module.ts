import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { JobsService } from '../services/jobs.service';
import { JobsController } from '../controllers/jobs.controller';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    TypeOrmModule.forFeature([User]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [JobsService, UsersService],
  controllers: [JobsController],
  exports: [JobsService],
})
export class JobsModule {}
