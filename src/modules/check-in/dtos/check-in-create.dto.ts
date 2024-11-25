import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CheckInCreateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  taskId!: Uuid;

  @ApiPropertyOptional({ type: 'number' })
  @IsNumberString()
  @IsOptional()
  latitude!: number;

  @ApiPropertyOptional({ type: 'number' })
  @IsNumberString()
  @IsOptional()
  longitude!: number;
}
