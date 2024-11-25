import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckInEntity } from '../check-in/check-in.entity';
import { LocationHistoryEntity } from '../location-history/location-history.entity';
import { LocationHistoryService } from '../location-history/location-history.service';
import { RoleEntity } from '../role/role.entity';
import { CreateSettingsHandler } from './commands/create-settings.command';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserSettingsEntity } from './user-settings.entity';

const handlers = [CreateSettingsHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserSettingsEntity,
      RoleEntity,
      UserSettingsEntity,
      CheckInEntity,
      LocationHistoryEntity,
    ]),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, LocationHistoryService, ...handlers],
})
export class UserModule {}
