import { IsNotEmpty } from 'class-validator';

import {
  DateFieldOptional,
  EmailField,
  PasswordField,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @DateFieldOptional({ nullable: true })
  birthday?: Date | null;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @IsNotEmpty()
  @StringField()
  phoneNumber!: string;
}
