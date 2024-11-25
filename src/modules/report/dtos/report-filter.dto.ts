import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ReportFilterDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  farmId!: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: Uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  areaId?: Uuid;
}
