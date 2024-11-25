import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddUsersDto {
  @ApiPropertyOptional()
  @IsArray()
  userIds: Uuid[] = [];
}
