import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionController } from './permission.controller';
import { PermissionEntity } from './permission.entity';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionController],
  exports: [PermissionService],
  providers: [PermissionService],
})
export class PermissionModule {}
