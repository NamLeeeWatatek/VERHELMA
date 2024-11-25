import type { CheckInEntity } from '../check-in.entity';

export class CheckInDto {
  userId!: Uuid;

  taskId!: Uuid;

  checkInImageUrls?: string[];

  checkOutImageUrls?: string[];

  checkInLatitude?: number;

  checkInLongitude?: number;

  checkOutLatitude?: number;

  checkOutLongitude?: number;

  checkInTime?: Date;

  checkOutTime?: Date | null;

  constructor(checkIn: CheckInEntity) {
    this.userId = checkIn.userId;
    this.taskId = checkIn.taskId;
    this.checkInImageUrls = checkIn.checkInImageUrls;
    this.checkOutImageUrls = checkIn.checkOutImageUrls;
    this.checkInLatitude = checkIn.checkInLatitude;
    this.checkInLongitude = checkIn.checkInLongitude;
    this.checkOutLatitude = checkIn.checkOutLatitude;
    this.checkOutLongitude = checkIn.checkOutLongitude;
    this.checkInTime = checkIn.checkInTime;
    this.checkOutTime = checkIn.checkOutTime;
  }
}
