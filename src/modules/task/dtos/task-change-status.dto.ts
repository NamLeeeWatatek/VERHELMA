import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { TaskStatus } from '../../../constants/task-status';

export class TaskChangeStatusDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  status: TaskStatus;

  constructor() {
    this.status = TaskStatus.ToDo;
  }
}
