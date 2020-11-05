import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Job } from '../../jobs/entities/job.entity';

const bcrypt = require('bcrypt');
const saltRounds = 10;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  @IsEmail()
  email: string;

  @Column({ length: 256 })
  full_name: string;

  @Column({nullable: true})
  profile_pic: string;

  @Column({ length: 256 })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  @OneToMany(
    type => Job,
    job => job.jobUUID,
    { cascade: true, nullable: true },
  )
  jobs: Job[];
}
