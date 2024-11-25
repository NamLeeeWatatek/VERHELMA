import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { TaskCommentEntity } from '../task-comment.entity';

export class CreateTaskCommentDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  taskId!: Uuid;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  userId!: Uuid;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  comment!: string;
}

export class UpdateTaskCommentDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  comment!: string;
}

export class TaskCommentDto {
  id!: Uuid;

  comment!: string;

  taskId!: Uuid;

  user!: UserBasicDto;

  createdAt!: Date;

  constructor(comment: TaskCommentEntity) {
    this.id = comment.id;
    this.taskId = comment.task.id;
    this.comment = comment.comment;
    this.user = new UserBasicDto(comment.user);
    this.createdAt = comment.createdAt;
  }
}
