import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 30})
  firstName: string;

  @Column({length: 30})
  lastName: string;

  @Column({length: 30, unique: true})
  email: string;

  @Column({length: 20})
  password: string;

  @OneToOne(type => Job, job=> job.author)
  @JoinColumn()
  jobs: Job[];
}