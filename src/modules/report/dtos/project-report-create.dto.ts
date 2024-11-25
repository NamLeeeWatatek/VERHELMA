import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class ReportRangeCreateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDateString()
  endDate!: Date;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  projectId!: Uuid;
}
