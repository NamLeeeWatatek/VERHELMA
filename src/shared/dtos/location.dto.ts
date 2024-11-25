import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LocationDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  latitude = 0;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  longitude = 0;

  constructor(latitude: number | null, longitude: number | null) {
    this.latitude = latitude ?? 0;
    this.longitude = longitude ?? 0;
  }
}
