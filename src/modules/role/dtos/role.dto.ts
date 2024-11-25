import { IsArray, IsOptional, IsString } from 'class-validator';
import type { RolePermission } from 'modules/role-permission/role-permission.entity';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PermissionDto } from '../../permission/dtos/permission.dto';
import type { RoleEntity } from '../role.entity';

export class RoleDto extends AbstractDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  permissions?: PermissionDto[];

  constructor(role: RoleEntity) {
    super(role);

    this.name = role.name.toString().toUpperCase().replaceAll('_', ' ');

    this.description = role.description;
    this.permissions = role.rolePermissions?.map(
      (rp: RolePermission) => new PermissionDto(rp.permission),
    );
  }
}
