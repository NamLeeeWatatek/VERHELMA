import type { NotificationType } from '../../../constants/notification-type.enum';

export class NotificationCreateDto {
  title!: string;

  body!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any = null;

  type!: NotificationType;
}
