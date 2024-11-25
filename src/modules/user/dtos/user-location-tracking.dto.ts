import { LocationDto } from '../../../shared/dtos/location.dto';

export class UserLocationTrackingDto {
  location: LocationDto;

  lastSeen: Date;

  constructor() {
    this.location = new LocationDto(0, 0);
    this.lastSeen = new Date();
  }
}
