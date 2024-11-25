import { AccountStatus } from '../../../constants/account-status';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { RoleDto } from '../../role/dtos/role.dto';
import type { UserEntity } from '../user.entity';

export class UserBasicDto {
  id: Uuid;

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

  role?: RoleDto;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.fullName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null;
    this.accountStatus = user.accountStatus;
    this.avatar = user.avatar;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role ? new RoleDto(user.role) : undefined;
  }
}
