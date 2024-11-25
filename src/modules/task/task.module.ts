import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AreaEntity } from '../area/area.entity';
import { DailyScheduledTaskEntity } from '../daily-scheduled-task/daily-scheduled-tasked.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { ProjectEntity } from '../project/project.entity';
import { SubtaskEntity } from '../subtask/subtask.entity';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { UserEntity } from '../user/user.entity';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      ProjectEntity,
      AreaEntity,
      UserEntity,
      TaskAssignmentEntity,
      SubtaskEntity,
      DailyScheduledTaskEntity,
      NotificationEntity,
    ]),
  ],
  controllers: [TaskController],
  exports: [TaskService],
  providers: [TaskService, NotificationService],
})
export class TaskModule {}
