import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AreaEntity } from '../area/area.entity';
import { CheckInEntity } from '../check-in/check-in.entity';
import { ProjectEntity } from '../project/project.entity';
import { SubtaskEntity } from '../subtask/subtask.entity';
import { TaskEntity } from '../task/task.entity';
import { TaskModule } from '../task/task.module';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { UserEntity } from '../user/user.entity';
import { DailyScheduledTaskController } from './daily-scheduled-task.controller';
import { DailyScheduledTaskService } from './daily-scheduled-task.service';
import { DailyScheduledTaskEntity } from './daily-scheduled-tasked.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyScheduledTaskEntity,
      TaskEntity,
      ProjectEntity,
      AreaEntity,
      UserEntity,
      TaskAssignmentEntity,
      SubtaskEntity,
      CheckInEntity,
    ]),
    TaskModule,
  ],
  controllers: [DailyScheduledTaskController],
  exports: [DailyScheduledTaskService],
  providers: [DailyScheduledTaskService],
})
export class DailyScheduledTaskModule {}
