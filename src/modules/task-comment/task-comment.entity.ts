import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';

@Entity('task_comments')
export class TaskCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @ManyToOne(() => TaskEntity, (task) => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: TaskEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column('text')
  comment!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
