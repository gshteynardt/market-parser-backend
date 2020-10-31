import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Job {
  @Column()
  title: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  jobUUID: string;

  @Column({ nullable: true })
  totalRows: number;

  @Column('bigint')
  createdAt: number;

  @ManyToOne(
    type => User,
    user => user.id,
    { cascade: true },
  )
  @JoinColumn()
  author: User;
}
