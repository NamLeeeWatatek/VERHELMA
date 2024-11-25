import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { RolePermission } from '../role-permission/role-permission.entity';
import { PermissionDto } from './dtos/permission.dto';

@Entity('permissions')
@UseDto(PermissionDto)
export class PermissionEntity extends AbstractEntity<PermissionDto> {
  @Column({ type: 'varchar', length: 50, unique: false })
  permissionName!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions!: RolePermission[];
}
