import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  jobUUID: string;

  @Column("boolean", {default: false})
  isFinished: boolean;

  @OneToOne(type=> User, user => user.jobs, {cascade: true})
  author: User
}