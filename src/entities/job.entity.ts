import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  jobUUID: string;

  /*@Column()
  createdAt: string;*/

  @ManyToOne(type=> User, user => user.id, {cascade: true})
  @JoinColumn()
  author: User
}