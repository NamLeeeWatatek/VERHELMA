import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProjectCreateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  farmId!: Uuid;
}
