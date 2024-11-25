import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AreaCreateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  constructor() {
    this.name = '';
    this.latitude = 1;
    this.longitude = 1;
  }
}
