import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TaskEntity } from '../task/task.entity';

@Entity('subtasks')
export class SubtaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @Column({ type: 'varchar', length: 255 })
  content!: string;

  @Column({ type: 'boolean', default: false })
  isCompleted!: boolean;

  @ManyToOne(() => TaskEntity, (task) => task.subtasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_task_id' })
  parentTask!: TaskEntity;
}
