import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import { In, Repository } from 'typeorm';

import { PageDto } from '../../common/dto/page.dto';
import { applySorting } from '../../common/utils';
import { RolePermission } from '../../modules/role-permission/role-permission.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { RoleDto } from './dtos/role.dto';
import type { RoleCreateDto } from './dtos/role-create.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createRole(roleCreateDto: RoleCreateDto): Promise<RoleEntity> {
    const role = this.roleRepository.create(roleCreateDto);
    await this.roleRepository.save(role);

    if (roleCreateDto.permissionIds && roleCreateDto.permissionIds.length > 0) {
      const permissions = await this.permissionRepository.find({
        where: { id: In(roleCreateDto.permissionIds) },
      });

      const foundPermissionIds = new Set(
        permissions.map((permission) => permission.id),
      );
      const missingPermissionIds = roleCreateDto.permissionIds.filter(
        (id) => !foundPermissionIds.has(id),
      );

      if (missingPermissionIds.length > 0) {
        throw new NotFoundException(
          `Permissions not found for IDs: ${missingPermissionIds.join(', ')}`,
        );
      }

      const rolePermissions = permissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
        role,
        permission,
      }));

      role.rolePermissions = rolePermissions;
      await this.rolePermissionRepository.save(rolePermissions);
    }

    return role;
  }

  async getRoles(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoleDto>> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission');

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(role.name) LIKE :name', {
        name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    const allowedSortColumns = ['name'];

    applySorting(queryBuilder, pageOptionsDto, 'role', allowedSortColumns);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    const roleDtos = items.map((role) => new RoleDto(role));

    return new PageDto<RoleDto>(roleDtos, pageMetaDto);
  }

  async getRole(roleId: string): Promise<RoleDto> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission')
      .where('role.id = :roleId', { roleId });

    const role = await queryBuilder.getOne();

    if (!role) {
      throw new NotFoundException(`Role not found for ID: ${roleId}`);
    }

    return new RoleDto(role);
  }

  async getPermissions(roleId: string): Promise<string[]> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission')
      .where('role.id = :roleId', { roleId });

    const role = await queryBuilder.getOne();

    return (
      role?.rolePermissions?.map((rp) => rp.permission.permissionName) ?? []
    );
  }

  async getPermissionsByRoleId(roleId: string): Promise<string[]> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission')
      .where('role.id = :roleId', { roleId });

    const role = await queryBuilder.getOne();

    if (!role) {
      throw new NotFoundException(`Role not found for ID: ${roleId}`);
    }

    return (
      role.rolePermissions?.map((rp) => rp.permission.permissionName) ?? []
    );
  }

  async updateRole(roleId: Uuid, roleUpdateDto: RoleCreateDto): Promise<void> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :roleId', { roleId });

    const roleEntity = await queryBuilder.getOne();

    if (!roleEntity) {
      throw new NotFoundException('Role not found');
    }

    Object.assign(roleEntity, roleUpdateDto);
    await this.roleRepository.save(roleEntity);

    if (roleUpdateDto.permissionIds && roleUpdateDto.permissionIds.length > 0) {
      const permissions = await this.permissionRepository.find({
        where: { id: In(roleUpdateDto.permissionIds) },
      });

      const foundPermissionIds = new Set(
        permissions.map((permission) => permission.id),
      );
      const missingPermissionIds = roleUpdateDto.permissionIds.filter(
        (id) => !foundPermissionIds.has(id),
      );

      if (missingPermissionIds.length > 0) {
        throw new NotFoundException(
          `Permissions not found for IDs: ${missingPermissionIds.join(', ')}`,
        );
      }

      await this.rolePermissionRepository.delete({ roleId: roleEntity.id });

      const rolePermissions = permissions.map((permission) => ({
        roleId: roleEntity.id,
        permissionId: permission.id,
      }));

      await this.rolePermissionRepository.save(rolePermissions);
    }
  }

  async deleteRole(roleId: Uuid): Promise<void> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id: roleId });

    const roleEntity = await queryBuilder.getOne();

    if (!roleEntity) {
      throw new NotFoundException(`Role not found for ID: ${roleId}`);
    }

    await this.roleRepository.remove(roleEntity);
  }
}
