import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { NotificationType } from '../../constants/notification-type.enum';
import { NotificationDto } from './dtos/notification.dto';
import { UseDto } from '../../decorators';

@Entity('notifications')
@UseDto(NotificationDto)
export class NotificationEntity extends AbstractEntity<NotificationDto> {
  @Column()
  userId!: string;

  @Column()
  title!: string;

  @Column('text')
  body!: string;

  @Column('json', { nullable: true, default: null })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any = null;

  @Column()
  type!: NotificationType;

  @Column({ default: false })
  isRead!: boolean;
}
