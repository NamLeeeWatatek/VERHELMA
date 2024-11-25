import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { RolePermission } from '../role-permission/role-permission.entity';
import { UserEntity } from '../user/user.entity';
import { RoleDto } from './dtos/role.dto';

@Entity('roles')
@UseDto(RoleDto)
export class RoleEntity extends AbstractEntity<RoleDto> {
  static entityName = 'role';

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users!: UserEntity[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions?: RolePermission[];
}
