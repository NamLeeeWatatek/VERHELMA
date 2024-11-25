import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { ClockInEntity } from '../clock-in.entity';

export class ClockInDto {
  user!: UserBasicDto;

  clockInImageUrls?: string[];

  clockOutImageUrls?: string[];

  clockInLatitude?: number;

  clockInLongitude?: number;

  clockOutLatitude?: number;

  clockOutLongitude?: number;

  clockInTime?: Date;

  clockOutTime?: Date | null;

  constructor(clockIn: ClockInEntity) {
    this.user = new UserBasicDto(clockIn.user);
    this.clockInImageUrls = clockIn.clockInImageUrls;
    this.clockOutImageUrls = clockIn.clockOutImageUrls;
    this.clockInLatitude = clockIn.clockInLatitude;
    this.clockInLongitude = clockIn.clockInLongitude;
    this.clockOutLatitude = clockIn.clockOutLatitude;
    this.clockOutLongitude = clockIn.clockOutLongitude;
    this.clockInTime = clockIn.clockInTime;
    this.clockOutTime = clockIn.clockOutTime;
  }
}
