import type { LocationHistoryEntity } from '../location-history.entity';

export class LocationHistoryBasicDto {
  latitude!: number;

  longitude!: number;

  createdAt!: Date;

  constructor(location: LocationHistoryEntity) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.createdAt = location.createdAt;
  }
}
