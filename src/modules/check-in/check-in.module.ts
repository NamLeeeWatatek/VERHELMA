import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';
import { CheckInController } from './check-in.controller';
import { CheckInEntity } from './check-in.entity';
import { CheckInService } from './check-in.service';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInEntity, UserEntity, TaskEntity])],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
