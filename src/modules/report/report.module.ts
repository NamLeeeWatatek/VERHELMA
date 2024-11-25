import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckInEntity } from '../check-in/check-in.entity';
import { FarmEntity } from '../farm/farm.entity';
import { ProjectEntity } from '../project/project.entity';
import { TaskEntity } from '../task/task.entity';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { UserEntity } from '../user/user.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TaskEntity,
      CheckInEntity,
      ProjectEntity,
      TaskAssignmentEntity,
      FarmEntity,
    ]),
  ],
  controllers: [ReportController],
  exports: [ReportService],
  providers: [ReportService],
})
export class ReportModule {}
