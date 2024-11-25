import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { PermissionEntity } from '../permission/permission.entity';
import { RoleEntity } from '../role/role.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn({ name: 'role_id' })
  roleId!: Uuid;

  @PrimaryColumn({ name: 'permission_id' })
  permissionId!: Uuid;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role!: RoleEntity;

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.rolePermissions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permission!: PermissionEntity;
}
