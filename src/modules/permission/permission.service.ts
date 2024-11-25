import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
// import { AreaEntity } from 'modules/area/area.entity';
// import { CheckInEntity } from 'modules/check-in/check-in.entity';
// import { DailyScheduledTaskEntity } from 'modules/daily-scheduled-task/daily-scheduled-tasked.entity';
// import { ProjectEntity } from 'modules/project/project.entity';
// import { RoleEntity } from 'modules/role/role.entity';
// import { TaskEntity } from 'modules/task/task.entity';
// import { UserEntity } from 'modules/user/user.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { applySorting } from '../../common/utils';
import { Action } from '../../constants/action.enum';
import type { PermissionDto } from './dtos/permission.dto';
import { PermissionCreateDto } from './dtos/permission-create.dto';
import { PermissionNotFoundException } from './exceptions/permission-not-found.exception';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  @Transactional()
  async createPermission(
    permissionCreateDto: PermissionCreateDto,
  ): Promise<PermissionEntity> {
    const permission = this.permissionRepository.create(permissionCreateDto);
    await this.permissionRepository.save(permission);

    return permission;
  }

  async getPermissions(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PermissionDto>> {
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');
    const allowedSortColumns = ['permissionName'];

    applySorting(
      queryBuilder,
      pageOptionsDto,
      'permission',
      allowedSortColumns,
    );

    if (pageOptionsDto.q) {
      queryBuilder.andWhere(
        'LOWER(permission.permissionName) LIKE :permissionName',
        {
          permissionName: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
        },
      );
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getPermission(permissionId: Uuid): Promise<PermissionDto> {
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');

    queryBuilder.where('permission.id = :permissionId', {
      permissionId,
    });

    const permissionEntity = await queryBuilder.getOne();

    if (!permissionEntity) {
      throw new PermissionNotFoundException();
    }

    return permissionEntity.toDto();
  }

  async deletePermission(id: Uuid): Promise<void> {
    const queryBuilder = this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.id = :id', { id });

    const permissionEntity = await queryBuilder.getOne();

    if (!permissionEntity) {
      throw new PermissionNotFoundException();
    }

    await this.permissionRepository.remove(permissionEntity);
  }

  async updatePermission(
    id: Uuid,
    permissionDto: PermissionCreateDto,
  ): Promise<void> {
    const queryBuilder = this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.id = :id', { id });

    const permissionEntity = await queryBuilder.getOne();

    if (!permissionEntity) {
      throw new PermissionNotFoundException();
    }

    this.permissionRepository.merge(permissionEntity, permissionDto);

    await this.permissionRepository.save(permissionEntity);
  }

  async generatePermissions(): Promise<void> {
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');

    const permissions = await queryBuilder.getMany();
    const existingPermissionNames = new Set(
      permissions.map((p: PermissionEntity) => p.permissionName),
    );

    const modules = [
      'area',
      'permission',
      'document',
      'document-category',
      'project',
      'role',
      'user',
    ];

    const newPermissions = [];

    for (const module of modules) {
      for (const action of Object.values(Action)) {
        const newPermissionName = `${module}:${action}`;

        if (!existingPermissionNames.has(newPermissionName)) {
          const permission = this.permissionRepository.create({
            permissionName: newPermissionName,
          });

          newPermissions.push(permission);
        }
      }
    }

    if (newPermissions.length > 0) {
      await this.permissionRepository.save(newPermissions);
    }
  }
}
