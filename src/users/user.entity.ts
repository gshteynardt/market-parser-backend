import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Job } from '../entities/job.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 30, nullable: true})
  nickName: string;

  @Column({length: 30, nullable: true})
  firstName: string;

  @Column({length: 30, nullable: true})
  lastName: string;

  @Column({length: 30, unique: true})
  email: string;

  @Column({length: 256})
  password: string;

  @OneToMany(type => Job, job=> job.jobUUID, {cascade: true, nullable: true})
  jobs: Job[];
}