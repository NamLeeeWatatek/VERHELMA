import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import type { SubtaskEntity } from 'modules/subtask/subtask.entity';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AreaEntity } from '../../area/area.entity';
import { ProjectEntity } from '../../project/project.entity';
import { SubtaskDto } from '../../subtask/dtos/subtask.dto';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { TaskEntity } from '../task.entity';

export class TaskDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  area?: AreaEntity;

  @IsOptional()
  @IsArray()
  assignedUsers?: UserBasicDto[];

  @IsOptional()
  project?: ProjectEntity;

  @IsInt()
  priority?: number = 1;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsNotEmpty()
  createdBy: UserBasicDto | null;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isCheckInPhotoRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isCheckOutPhotoRequired?: boolean;

  subtasks?: SubtaskDto[];

  verifier: UserBasicDto | null;

  constructor(task: TaskEntity) {
    super(task);
    this.title = task.title;
    this.description = task.description;
    this.area = task.area;
    this.assignedUsers = task.assignedUsers
      ?.map((user) => (user.user ? new UserBasicDto(user.user) : null))
      .filter((user) => user !== null);
    this.project = task.project;
    this.priority = task.priority;
    this.dueDate = task.dueDate;
    this.startDate = task.startDate;
    this.createdBy = task.createdBy ? new UserBasicDto(task.createdBy) : null;
    this.status = task.status;
    this.isCheckInPhotoRequired = task.isCheckInPhotoRequired;
    this.isCheckOutPhotoRequired = task.isCheckOutPhotoRequired;
    this.subtasks = task.subtasks?.map(
      (st: SubtaskEntity) => new SubtaskDto(st),
    );
    this.verifier = task.verifier ? new UserBasicDto(task.verifier) : null;
  }
}
