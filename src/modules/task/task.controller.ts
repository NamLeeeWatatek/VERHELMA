import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageResponse, AuthUser, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { SubTaskResponseDto } from '../subtask/dtos/subtask.response.dto';
import { SubtaskCreateDto } from '../subtask/dtos/subtask-create.dto';
import { UserEntity } from '../user/user.entity';
import type { EmployeeLocationDto } from './dtos/employee-location.response.dto';
import { TaskDto } from './dtos/task.dto';
import { TaskChangeStatusDto } from './dtos/task-change-status.dto';
import { TaskCreateDto } from './dtos/task-create.dto';
import { TaskFilterDto } from './dtos/task-filter.dto';
import { TaskUpdateDto } from './dtos/task-update.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: TaskDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid task data',
  })
  async createTask(
    @AuthUser() user: UserEntity,
    @Body() taskCreateDto: TaskCreateDto,
  ) {
    const taskEntity = await this.taskService.createTask(taskCreateDto, user);

    return new TaskDto(taskEntity);
  }

  @Get()
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of tasks' })
  @ApiPageResponse({
    description: 'Retrieve a list of tasks with pagination',
    type: PageDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid pagination data',
  })
  async getTasks(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @Query(new ValidationPipe({ transform: true }))
    taskFilterDto: TaskFilterDto,
  ): Promise<PageDto<TaskDto>> {
    return this.taskService.getTasks(pageOptionsDto, taskFilterDto);
  }

  @Get('my-tasks')
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of own tasks' })
  async getLoggedInUserTasks(
    @AuthUser() user: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @Query(new ValidationPipe({ transform: true }))
    taskFilterDto: TaskFilterDto,
  ): Promise<PageDto<TaskDto>> {
    return this.taskService.getLoggedInUserTasks(
      user,
      pageOptionsDto,
      taskFilterDto,
    );
  }

  @Get('to-verify')
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of tasks to verify' })
  async getTasksToVerify(
    @AuthUser() user: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @Query(new ValidationPipe({ transform: true }))
    taskFilterDto: TaskFilterDto,
  ): Promise<PageDto<TaskDto>> {
    return this.taskService.getTasksToVerify(
      user,
      pageOptionsDto,
      taskFilterDto,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task details by ID' })
  @ApiOkResponse({
    description: 'Task details retrieved successfully',
    type: TaskDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  async getTask(@UUIDParam('id') id: Uuid): Promise<TaskDto> {
    return this.taskService.getTask(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task details' })
  @ApiOkResponse({
    description: 'Task updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data',
  })
  async updateTask(
    @UUIDParam('id') id: Uuid,
    @Body() taskUpdateDto: TaskUpdateDto,
  ): Promise<void> {
    return this.taskService.updateTask(id, taskUpdateDto);
  }

  @Put('/change-status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update task's status" })
  @ApiOkResponse({
    description: 'Changed status successfully',
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  async updateTaskStatus(
    @UUIDParam('id') id: Uuid,
    @Body() updateTaskStatusDto: TaskChangeStatusDto,
  ): Promise<void> {
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiNoContentResponse({
    description: 'Task deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  async deleteTask(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks assigned to a user by user ID' })
  @ApiOkResponse({
    description: 'Tasks assigned to the user retrieved successfully',
    type: PageDto,
  })
  @ApiNotFoundResponse({
    description: 'No tasks found for the user',
  })
  async getTaskByUserId(
    @UUIDParam('userId') userId: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TaskDto>> {
    return this.taskService.getTasksByUserId(userId, pageOptionsDto);
  }

  //   @UseGuards(AuthGuard({ public: false }))
  //   @ApiBearerAuth()
  //   @Get('/my-tasks')
  //   async getTasksForLoggedInUser(
  //     @AuthUser() user: UserEntity,
  //     @Query(new ValidationPipe({ transform: true }))
  //     pageOptionsDto: PageOptionsDto,
  //   ): Promise<PageDto<TaskDto>> {
  //     console.log('Userr:', user);

  //     return this.taskService.getTasksByUserId(user.id, pageOptionsDto);
  //   }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post(':taskId/sub-task')
  @ApiParam({
    name: 'taskId',
    type: 'string',
    description: 'ID of the task',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sub-task' })
  @ApiCreatedResponse({
    description: 'Sub-task created successfully',
    type: SubTaskResponseDto,
  })
  async createSubtask(
    @UUIDParam('taskId') taskId: Uuid,
    @Body() subtaskCreateDto: SubtaskCreateDto,
  ) {
    return this.taskService.createNewSubtask(taskId, subtaskCreateDto.content);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Patch(':taskId/sub-task/:subtaskId/change-status')
  @ApiParam({
    name: 'taskId',
    type: 'string',
    description: 'ID of the task',
  })
  @ApiParam({
    name: 'subtaskId',
    type: 'string',
    description: 'ID of the sub-task to change its status',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change a sub-task' status" })
  @ApiOkResponse({
    description: 'Subtask updated successfully',
  })
  async changeSubtaskStatus(
    @UUIDParam('taskId') taskId: Uuid,
    @UUIDParam('subtaskId') subtaskId: Uuid,
  ) {
    await this.taskService.changeSubtaskStatus(taskId, subtaskId);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Put(':taskId/sub-task/:subTaskId')
  @ApiParam({
    name: 'taskId',
    type: 'string',
    description: 'ID of the task',
  })
  @ApiParam({
    name: 'subTaskId',
    type: 'string',
    description: 'ID of the sub-task',
  })
  @ApiOperation({ summary: 'Update sub-task content' })
  async updateSubtask(
    @UUIDParam('taskId') taskId: Uuid,
    @UUIDParam('subTaskId') subTaskId: Uuid,
    @Body() subtaskCreateDto: SubtaskCreateDto,
  ) {
    return this.taskService.updateSubtaskContent(
      taskId,
      subTaskId,
      subtaskCreateDto.content,
    );
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Delete(':taskId/sub-task/:subtaskId')
  @ApiParam({
    name: 'taskId',
    type: 'string',
    description: 'ID of the task',
  })
  @ApiParam({
    name: 'subtaskId',
    type: 'string',
    description: 'ID of the subtask',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a sub-task' })
  async deleteSubtask(
    @UUIDParam('taskId') taskId: Uuid,
    @UUIDParam('subtaskId') subtaskId: Uuid,
  ) {
    await this.taskService.deleteSubtask(taskId, subtaskId);
  }

  @Post('assign/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a task to multiple users' })
  @ApiParam({
    name: 'taskId',
    type: 'string',
    description: 'ID of the task to assign',
  })
  @ApiOkResponse({
    description: 'Task assigned successfully to users',
  })
  @ApiNotFoundResponse({
    description: 'Task or user(s) not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid task or user data',
  })
  async assignTaskToUsers(
    @UUIDParam('taskId') taskId: Uuid,
    @Body() assignedUsers: Uuid[],
  ): Promise<void> {
    return this.taskService.assignTaskToUsers(taskId, assignedUsers);
  }

  @Get('employee-location/:taskId')
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get location of employees' })
  async getEmployeeLocations(
    @AuthUser() user: UserEntity,
    @UUIDParam('taskId') taskId: Uuid,
  ): Promise<EmployeeLocationDto[]> {
    return this.taskService.getEmployeeLocations(user, taskId);
  }
}
