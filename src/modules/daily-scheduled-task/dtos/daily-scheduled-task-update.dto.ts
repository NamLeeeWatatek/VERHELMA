import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class DailyScheduledTaskUpdateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  areaId?: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  assignedUserIds?: Uuid[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCheckInPhotoRequired?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCheckOutPhotoRequired?: boolean = true;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subtaskContents?: string[];

  constructor() {
    this.title = '';
  }
}
