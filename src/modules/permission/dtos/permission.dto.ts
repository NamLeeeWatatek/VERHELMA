import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { PermissionEntity } from '../permission.entity';

export class PermissionDto extends AbstractDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  permissionName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  constructor(permissionEntity: PermissionEntity) {
    super(permissionEntity);

    this.permissionName = permissionEntity.permissionName;
    this.description = permissionEntity.description;
  }
}
