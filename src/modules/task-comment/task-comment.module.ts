import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';
import { TaskCommentController } from './task-comment.controller';
import { TaskCommentEntity } from './task-comment.entity';
import { TaskCommentService } from './task-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskCommentEntity, TaskEntity, UserEntity]),
  ],
  providers: [TaskCommentService],
  controllers: [TaskCommentController],
})
export class TaskCommentModule {}
