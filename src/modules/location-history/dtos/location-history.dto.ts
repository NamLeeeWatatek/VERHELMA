import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { LocationHistoryEntity } from '../location-history.entity';

export class LocationHistoryDto extends AbstractDto {
  latitude: number;

  longitude: number;

  user: UserBasicDto | null;

  constructor(locationHistory: LocationHistoryEntity) {
    super(locationHistory);
    this.latitude = locationHistory.latitude;
    this.longitude = locationHistory.longitude;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.user = locationHistory.user
      ? new UserBasicDto(locationHistory.user)
      : null;
  }
}
