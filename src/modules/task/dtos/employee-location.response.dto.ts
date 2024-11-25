import { ClassField } from '../../../decorators';
import { LocationDto } from '../../../shared/dtos/location.dto';
import { UserDto } from '../../user/dtos/user.dto';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { UserEntity } from '../../user/user.entity';

export class EmployeeLocationDto {
  @ClassField(() => UserDto)
  user?: UserBasicDto;

  @ClassField(() => LocationDto)
  location?: LocationDto;

  constructor(user: UserEntity) {
    this.user = new UserBasicDto(user);
    this.location = new LocationDto(user.latitude, user.longitude);
  }
}
