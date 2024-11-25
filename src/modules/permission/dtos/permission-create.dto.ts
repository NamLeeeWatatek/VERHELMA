import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PermissionCreateDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  permissionName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  constructor() {
    this.permissionName = '';
  }
}
