import { HttpModule, Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './jobs.module';
import { UsersModule } from './users.module';
import { User } from '../entities/user.entity';
import { Job } from '../entities/job.entity';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }), TypeOrmModule.forRoot(
    {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "root",
      "database": "PriceParser",
      "entities": [User, Job],
      "synchronize": true,
      "retryAttempts": 20,
      "retryDelay": 2000,
      "autoLoadEntities": true
    }
  ), UsersModule, JobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}