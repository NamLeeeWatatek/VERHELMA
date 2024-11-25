import { IsNotEmpty } from 'class-validator';

import {
  DateFieldOptional,
  EmailField,
  StringField,
} from '../../../decorators';

export class UserUpdateDto {
  @StringField()
  readonly firstName: string;

  @StringField()
  readonly lastName: string;

  @EmailField()
  readonly email: string;

  @DateFieldOptional({ nullable: true })
  birthday?: Date | null;

  @IsNotEmpty()
  @StringField()
  phoneNumber?: string;

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.birthday = new Date();
    this.phoneNumber = '';
  }
}
