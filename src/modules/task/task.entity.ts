import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { TaskStatus } from '../../constants/task-status';
import { UseDto } from '../../decorators';
import { AreaEntity } from '../area/area.entity';
import { DailyScheduledTaskEntity } from '../daily-scheduled-task/daily-scheduled-tasked.entity';
import { ProjectEntity } from '../project/project.entity';
import { SubtaskEntity } from '../subtask/subtask.entity';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { TaskCommentEntity } from '../task-comment/task-comment.entity';
import { UserEntity } from '../user/user.entity';
import { TaskDto } from './dtos/task.dto';

@Entity('tasks')
@UseDto(TaskDto)
export class TaskEntity extends AbstractEntity<TaskDto> {
  static entityName = 'task';

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => AreaEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'area_id' })
  area?: AreaEntity;

  @OneToMany(
    () => TaskAssignmentEntity,
    (taskAssignment) => taskAssignment.task,
  )
  assignedUsers?: TaskAssignmentEntity[];

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;

  @ManyToOne(() => DailyScheduledTaskEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_task_id' })
  sourceTask?: DailyScheduledTaskEntity;

  @Column({ type: 'int', default: 1 })
  priority?: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserEntity;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.ToDo,
  })
  status!: TaskStatus;

  @Column({ type: 'boolean', default: true })
  isCheckInPhotoRequired?: boolean;

  @Column({ type: 'boolean', default: false })
  isCheckOutPhotoRequired?: boolean;

  @ManyToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  verifier: UserEntity | null = null;

  @OneToMany(() => TaskCommentEntity, (comment) => comment.task)
  comments!: TaskCommentEntity[];

  @OneToMany(() => SubtaskEntity, (subtask) => subtask.parentTask)
  subtasks?: SubtaskEntity[];
}
