import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';

@Entity('check_ins')
export class CheckInEntity {
  static entityName = 'check-in';

  @PrimaryColumn('uuid')
  userId!: Uuid;

  @PrimaryColumn('uuid')
  taskId!: Uuid;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user!: UserEntity;

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE' })
  task!: TaskEntity;

  @Column('text', { array: true, nullable: true })
  checkInImageUrls?: string[];

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  checkInLatitude!: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  checkInLongitude!: number;

  @Column('text', { array: true, nullable: true })
  checkOutImageUrls?: string[];

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  checkOutLatitude?: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  checkOutLongitude?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkInTime!: Date;

  @Column('timestamp', { nullable: true })
  checkOutTime!: Date | null;
}
