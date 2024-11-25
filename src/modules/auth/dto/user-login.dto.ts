import { IsOptional } from 'class-validator';

import { StringField } from '../../../decorators';

export class UserLoginDto {
  @StringField()
  readonly identifier!: string;

  @StringField()
  readonly password!: string;

  @StringField()
  @IsOptional()
  readonly deviceToken?: string;
}
