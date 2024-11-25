import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { TaskStatus } from '../../../constants/task-status';
import { ToBoolean } from '../../../decorators';

export class TaskFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  priority?: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Range time for startDate',
    example: ['2024-11-01T00:00:00.000Z', '2024-11-02T00:00:00.000Z'],
  })
  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  startDateRange?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Range time for dueDate',
    example: ['2024-11-01T00:00:00.000Z', '2024-11-02T00:00:00.000Z'],
  })
  @IsOptional()
  @IsDateString({}, { each: true })
  dueDateRange?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isCheckInPhotoRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isCheckOutPhotoRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  areaId?: Uuid;
}
