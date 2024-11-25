import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AccountStatus } from '../../../constants/account-status';
import {
  BooleanFieldOptional,
  DateFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { RoleDto } from '../../role/dtos/role.dto';
import type { UserEntity } from '../user.entity';
import { UserBasicDto } from './user-basic.response.dto';

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @StringFieldOptional({ nullable: true })
  fullName?: string | null;

  @EnumFieldOptional(() => AccountStatus)
  accountStatus!: AccountStatus;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringField({ nullable: true })
  phoneNumber?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  @DateFieldOptional({ nullable: true }) // Thêm trường birthday
  birthday?: Date | null;

  supervisor?: UserBasicDto | null;

  role?: RoleDto;

  latitude = 0;

  longitude = 0;



  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.userName;
    this.fullName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null;
    this.supervisor = user.supervisor
      ? new UserBasicDto(user.supervisor)
      : null;
    this.accountStatus = user.accountStatus;
    this.avatar = user.avatar;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.birthday = user.birthday;
    this.role = user.role ? new RoleDto(user.role) : undefined;
    this.longitude = user.longitude ?? 0;
    this.latitude = user.latitude ?? 0;
  }
}
