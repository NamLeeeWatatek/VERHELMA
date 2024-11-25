import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { AccountStatus } from '../../../constants/account-status';
import { StringField } from '../../../decorators/field.decorators';

export class UserFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @StringField()
  role?: string;
}
