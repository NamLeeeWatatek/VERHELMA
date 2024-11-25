import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class ClockInCreateDto {
  @ApiPropertyOptional({ type: 'number' })
  @IsNumberString()
  @IsOptional()
  latitude!: number;

  @ApiPropertyOptional({ type: 'number' })
  @IsNumberString()
  @IsOptional()
  longitude!: number;
}
