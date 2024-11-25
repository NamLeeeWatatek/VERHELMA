import type { SubtaskEntity } from '../subtask.entity';

export class SubtaskDto {
  id: Uuid;

  content: string;

  isCompleted = false;

  constructor(subtask: SubtaskEntity) {
    this.id = subtask.id;
    this.content = subtask.content;
    this.isCompleted = subtask.isCompleted;
  }
}
