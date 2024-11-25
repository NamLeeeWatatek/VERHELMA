import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageResponse, UUIDParam } from '../../decorators';
import type { NotificationDto } from './dtos/notification.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  //   @Post()
  //   @HttpCode(HttpStatus.CREATED)
  //   @ApiOperation({ summary: 'Create a new notification' })
  //   @ApiCreatedResponse({ type: NotificationDto })
  //   @ApiBody({
  //     type: NotificationCreateDto,
  //     description: 'Details of the notification to be created',
  //   })
  //   async createNotification(
  //     @Body() notificationCreateDto: NotificationCreateDto,
  //   ) {
  //     const notificationEntity =
  //       await this.notificationService.createNotification(notificationCreateDto);

  //     return notificationEntity.toDto();
  //   }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of notifications' })
  @ApiPageResponse({
    description: 'Get notifications list',
    type: PageDto,
  })
  getNotifications(
    @UUIDParam('id') userId: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<NotificationDto>> {
    return this.notificationService.getNotificationsByUserId(
      userId,
      pageOptionsDto,
    );
  }

  //   @Get(':id')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: 'Retrieve a specific permission by its ID' })
  //   @ApiParam({ name: 'id', description: 'UUID of the permission to retrieve' })
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     description: 'Get permission',
  //     type: PermissionDto,
  //   })
  //   getPermission(@UUIDParam('id') permissionId: Uuid): Promise<PermissionDto> {
  //     return this.permissionService.getPermission(permissionId);
  //   }
}
