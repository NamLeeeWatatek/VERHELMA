import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';
import type {
  CreateTaskCommentDto,
  UpdateTaskCommentDto,
} from './dtos/task-comment.dto';
import { TaskCommentDto } from './dtos/task-comment.dto';
import { TaskCommentEntity } from './task-comment.entity';

@Injectable()
export class TaskCommentService {
  constructor(
    @InjectRepository(TaskCommentEntity)
    private readonly taskCommentRepository: Repository<TaskCommentEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createComment(dto: CreateTaskCommentDto): Promise<TaskCommentEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: dto.taskId },
    });
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const taskComment = this.taskCommentRepository.create({
      comment: dto.comment,
      task,
      user,
    });

    return this.taskCommentRepository.save(taskComment);
  }

  async getCommentsByTaskId(taskId: Uuid): Promise<TaskCommentDto[]> {
    const comments = await this.taskCommentRepository.find({
      where: {
        task: {
          id: taskId,
        },
      },
      relations: ['task', 'user'],
    });

    return comments.map((comment) => new TaskCommentDto(comment));
  }

  async updateTaskComment(
    id: Uuid,
    taskCommentUpdateDto: UpdateTaskCommentDto,
  ): Promise<void> {
    const taskComment = await this.taskCommentRepository.findOne({
      where: { id },
    });

    if (!taskComment) {
      throw new NotFoundException('Task comment not found');
    }

    taskComment.comment = taskCommentUpdateDto.comment;

    await this.taskCommentRepository.save(taskComment);
  }

  async deleteTaskComment(id: Uuid): Promise<void> {
    const taskComment = await this.taskCommentRepository.findOne({
      where: { id },
    });

    if (!taskComment) {
      throw new NotFoundException('Task comment not found');
    }

    await this.taskCommentRepository.remove(taskComment);
  }
}
