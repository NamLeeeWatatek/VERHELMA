import type { CheckInEntity } from '../check-in.entity';

export class CheckInInfo {
  checkInTime: Date | null;

  checkOutTime: Date | null;

  workDuration: number; // Thời gian làm việc, tính bằng phút

  checkInLocation: {
    latitude: number;
    longitude: number;
  } | null;

  checkOutLocation: {
    latitude: number;
    longitude: number;
  } | null;

  checkInImages: string[];

  checkOutImages: string[];

  constructor(checkIn: CheckInEntity) {
    this.checkInTime = checkIn.checkInTime;
    this.checkOutTime = checkIn.checkOutTime;

    if (this.checkOutTime) {
      const diff =
        (this.checkOutTime.getTime() - this.checkInTime.getTime()) / 1000 / 60;
      this.workDuration = Math.max(0, diff);
    } else {
      this.workDuration = 0;
    }

    this.checkInLocation =
      checkIn.checkInLatitude && checkIn.checkInLongitude
        ? {
            latitude: checkIn.checkInLatitude,
            longitude: checkIn.checkInLongitude,
          }
        : null;

    this.checkOutLocation =
      checkIn.checkOutLatitude && checkIn.checkOutLongitude
        ? {
            latitude: checkIn.checkOutLatitude,
            longitude: checkIn.checkOutLongitude,
          }
        : null;

    this.checkInImages = checkIn.checkInImageUrls ?? [];

    this.checkOutImages = checkIn.checkOutImageUrls ?? [];
  }
}
