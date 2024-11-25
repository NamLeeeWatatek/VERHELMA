import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';

@Entity('task_assignments')
export class TaskAssignmentEntity {
  static entityName = 'task_assignment';

  @PrimaryColumn({ name: 'task_id' })
  taskId!: Uuid;

  @PrimaryColumn({ name: 'user_id' })
  userId!: Uuid;

  @ManyToOne(() => TaskEntity, (task) => task.assignedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id', referencedColumnName: 'id' })
  task?: TaskEntity;

  @ManyToOne(() => UserEntity, (user) => user.taskAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;
}
