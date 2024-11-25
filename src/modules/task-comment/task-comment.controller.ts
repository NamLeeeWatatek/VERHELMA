import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UUIDParam } from '../../decorators';
import {
  CreateTaskCommentDto,
  TaskCommentDto,
  UpdateTaskCommentDto,
} from './dtos/task-comment.dto';
import { TaskCommentService } from './task-comment.service';

@Controller('task-comments')
@ApiTags('task-comments')
export class TaskCommentController {
  constructor(private taskCommentService: TaskCommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task comment' })
  @ApiCreatedResponse({ type: TaskCommentDto })
  @ApiBody({
    type: CreateTaskCommentDto,
    description: 'Details of the task comment to be created',
  })
  async createTaskComment(@Body() taskCommentCreateDto: CreateTaskCommentDto) {
    const taskCommentEntity =
      await this.taskCommentService.createComment(taskCommentCreateDto);

    return new TaskCommentDto(taskCommentEntity);
  }

  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve comments for a specific task by task ID' })
  @ApiParam({
    name: 'taskId',
    description: 'UUID of the task to retrieve comments for',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get comments for the task',
    type: [TaskCommentDto],
  })
  async getCommentsByTaskId(
    @UUIDParam('taskId') taskId: Uuid,
  ): Promise<TaskCommentDto[]> {
    return this.taskCommentService.getCommentsByTaskId(taskId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing task comment' })
  @ApiParam({ name: 'id', description: 'UUID of the task comment to update' })
  @ApiBody({
    type: UpdateTaskCommentDto,
    description: 'Updated task comment data',
  })
  @ApiOkResponse({ description: 'Task comment updated successfully' })
  updateTaskComment(
    @UUIDParam('id') id: Uuid,
    @Body() taskCommentUpdateDto: UpdateTaskCommentDto,
  ): Promise<void> {
    return this.taskCommentService.updateTaskComment(id, taskCommentUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific task comment' })
  @ApiParam({ name: 'id', description: 'UUID of the task comment to delete' })
  @ApiNoContentResponse({ description: 'Task comment deleted successfully' })
  async deleteTaskComment(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.taskCommentService.deleteTaskComment(id);
  }
}
