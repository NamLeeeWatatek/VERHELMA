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

export class DailyScheduledTaskCreateDto {
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
  @IsNotEmpty()
  startDate!: Date;

  @ApiPropertyOptional()
  @IsNotEmpty()
  endDate!: Date;

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
