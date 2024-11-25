import type { TaskEntity } from '../../task/task.entity';
import type { SubtaskEntity } from '../subtask.entity';

export class SubTaskResponseDto {
  id: Uuid;

  content!: string;

  isCompleted: boolean;

  parentTask: TaskEntity;

  constructor(task: SubtaskEntity) {
    this.id = task.id;
    this.content = task.content;
    this.isCompleted = task.isCompleted;
    this.parentTask = task.parentTask;
  }
}
