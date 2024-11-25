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

import type { NotificationDto } from './dtos/notification.dto';
import { NotificationCreateDto } from './dtos/notification-create.dto';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  @Transactional()
  async createNotification(
    userId: Uuid,
    notificationCreateDto: NotificationCreateDto,
  ): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create(
      notificationCreateDto,
    );

    notification.userId = userId;

    await this.notificationRepository.save(notification);

    return notification;
  }

  async createNotificationForManyUsers(
    userIds: Uuid[],
    notificationCreateDto: NotificationCreateDto,
  ): Promise<NotificationEntity[]> {
    const notifications: NotificationEntity[] = [];

    for (const userId of userIds) {
      const notification = this.notificationRepository.create(
        notificationCreateDto,
      );
      notification.userId = userId;

      notifications.push(notification);
    }

    await this.notificationRepository.save(notifications);

    return notifications;
  }

  async getNotificationsByUserId(
    userId: Uuid,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<NotificationDto>> {
    const queryBuilder =
      this.notificationRepository.createQueryBuilder('notification');
    queryBuilder
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC'); 

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  //   async getPermission(permissionId: Uuid): Promise<PermissionDto> {
  //     const queryBuilder =
  //       this.permissionRepository.createQueryBuilder('permission');

  //     queryBuilder.where('permission.id = :permissionId', {
  //       permissionId,
  //     });

  //     const permissionEntity = await queryBuilder.getOne();

  //     if (!permissionEntity) {
  //       throw new PermissionNotFoundException();
  //     }

  //     return permissionEntity.toDto();
  //   }

  //   async deletePermission(id: Uuid): Promise<void> {
  //     const queryBuilder = this.permissionRepository
  //       .createQueryBuilder('permission')
  //       .where('permission.id = :id', { id });

  //     const permissionEntity = await queryBuilder.getOne();

  //     if (!permissionEntity) {
  //       throw new PermissionNotFoundException();
  //     }

  //     await this.permissionRepository.remove(permissionEntity);
  //   }

  //   async updatePermission(
  //     id: Uuid,
  //     permissionDto: PermissionCreateDto,
  //   ): Promise<void> {
  //     const queryBuilder = this.permissionRepository
  //       .createQueryBuilder('permission')
  //       .where('permission.id = :id', { id });

  //     const permissionEntity = await queryBuilder.getOne();

  //     if (!permissionEntity) {
  //       throw new PermissionNotFoundException();
  //     }

  //     this.permissionRepository.merge(permissionEntity, permissionDto);

  //     await this.permissionRepository.save(permissionEntity);
  //   }

  //   entities: string[] = [
  //     AreaEntity.entityName,
  //     CheckInEntity.entityName,
  //     DailyScheduledTaskEntity.entityName,
  //     ProjectEntity.entityName,
  //     RoleEntity.entityName,
  //     TaskEntity.entityName,
  //     UserEntity.entityName,
  //   ];

  //   async generatePermissions(): Promise<void> {
  //     const queryBuilder = this.permissionRepository
  //       .createQueryBuilder('permission')
  //       .where('permission.id = :id', { id });
  //     const permissionEntity = await queryBuilder.getOne();

  //     if (!permissionEntity) {
  //       throw new PermissionNotFoundException();
  //     }

  //     this.permissionRepository.merge(permissionEntity, permissionDto);

  //     await this.permissionRepository.save(permissionEntity);
  //   }
}
