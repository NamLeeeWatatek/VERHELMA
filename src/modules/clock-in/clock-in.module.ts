import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';
import { ClockInController } from './clock-in.controller';
import { ClockInEntity } from './clock-in.entity';
import { ClockInService } from './clock-in.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClockInEntity, UserEntity, TaskEntity])],
  controllers: [ClockInController],
  providers: [ClockInService],
})
export class ClockInModule {}
