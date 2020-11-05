import {Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Job } from '../entities/job.entity';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, unique: true })
  @IsEmail()
  email:string;

  @Column({ length: 256 })
  full_name:string;

  @Column({ length: 256 })
  password:string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  @OneToMany(type => Job, job=> job.jobUUID, {cascade: true, nullable: true})
  jobs: Job[];
}