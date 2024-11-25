import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class ReportMonthlyCreateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDateString()
  monthTime!: Date;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  projectId!: Uuid;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  userIds!: Uuid[];
}
