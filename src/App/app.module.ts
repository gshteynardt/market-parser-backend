import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UsersModule } from '../users/users.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'PriceParser',
      entities: [User, Job],
      synchronize: true,
      retryAttempts: 20,
      retryDelay: 2000,
      autoLoadEntities: true,
    }),
    UsersModule,
    JobsModule,
  ],
})
export class AppModule {}
