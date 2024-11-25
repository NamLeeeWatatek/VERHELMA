import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TaskStatus } from '../../../constants/task-status';

export class TaskUpdateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  areaId?: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  assignedUserIds?: Uuid[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: Uuid;

  @ApiPropertyOptional()
  @IsInt()
  priority?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCheckInPhotoRequired?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCheckOutPhotoRequired?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  verifierId?: Uuid;

  constructor() {
    this.title = '';
    this.priority = 1;
    this.status = TaskStatus.ToDo;
  }
}
