import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { NotificationType } from '../../../constants/notification-type.enum';
import type { NotificationEntity } from '../notification.entity';

export class NotificationDto extends AbstractDto {
  userId!: string;

  title!: string;

  body!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;

  type!: NotificationType;

  isRead!: boolean;

  constructor(notfication: NotificationEntity) {
    super(notfication);
    this.userId = notfication.userId;
    this.title = notfication.title;
    this.body = notfication.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data = notfication.data;
    this.type = notfication.type;
    this.isRead = notfication.isRead;
    this.createdAt = notfication.createdAt;
  }
}
