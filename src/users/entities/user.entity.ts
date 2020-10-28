import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ length: 30, unique: true })
  email: string;

  @Column({ length: 20 })
  password: string;

  @OneToMany((type) => Job, (job) => job.jobUUID, {
    cascade: true,
    nullable: true,
  })
  jobs: Job[];
}
