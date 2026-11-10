import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,} from 'typeorm';
import { Priority, Status } from '@app/contract/todo';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.medium,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.pending, 
  })
  status: Status;
  
  @Column({ type: 'int', default: 0, comment: 'Длительность в минутах' })
  durationMinutes: number;

  @Column({ type: 'uuid', default: null})
  parent: null | string;

}

