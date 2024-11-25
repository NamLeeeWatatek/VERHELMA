import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { AreaEntity } from '../area/area.entity';
import { ProjectEntity } from '../project/project.entity';
import { SubtaskEntity } from '../subtask/subtask.entity';
import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';
import type { DailyScheduledTaskDto } from './dtos/daily-scheduled-tasked.dto';

@Entity('daily_scheduled_tasks')
export class DailyScheduledTaskEntity extends AbstractEntity<DailyScheduledTaskDto> {
  static entityName = 'daily-scheduled-checkin';

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  title!: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description?: string;

  @ManyToOne(() => AreaEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'area_id' })
  area?: AreaEntity;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  assignedUserIds?: Uuid[];

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;

  @Column({ type: 'int', default: 1 })
  priority?: number;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  endDate?: Date;

  @Column({ type: 'time', nullable: true })
  @IsOptional()
  startTime?: string;

  @Column({ type: 'time', nullable: true })
  @IsOptional()
  endTime?: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isCheckInPhotoRequired?: boolean = true;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isCheckOutPhotoRequired?: boolean = true;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy!: UserEntity;

  @OneToMany(() => SubtaskEntity, (subtask) => subtask.parentTask)
  subtasks?: SubtaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.sourceTask, { cascade: true })
  dailyTasks?: TaskEntity[];
}
