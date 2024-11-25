import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolePermission } from '../../modules/role-permission/role-permission.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, RolePermission, PermissionEntity]),
  ],
  controllers: [RoleController],
  exports: [RoleService],
  providers: [RoleService],
})
export class RoleModule {}
