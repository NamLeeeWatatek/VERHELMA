import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AuthUser, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { DailyScheduledTaskService } from './daily-scheduled-task.service';
import type { DailyScheduledTaskEntity } from './daily-scheduled-tasked.entity';
import { DailyScheduledTaskCreateDto } from './dtos/daily-scheduled-task-create.dto';
import { DailyScheduledTaskDto } from './dtos/daily-scheduled-tasked.dto';

@ApiTags('daily-scheduled-tasks')
@Controller('daily-scheduled-tasks')
@UsePipes(new ValidationPipe({ transform: true }))
export class DailyScheduledTaskController {
  constructor(private readonly taskService: DailyScheduledTaskService) {}

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new daily scheduled task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @AuthUser() user: UserEntity,
    @Body() createDto: DailyScheduledTaskCreateDto,
  ): Promise<DailyScheduledTaskEntity> {
    return this.taskService.create(createDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all daily scheduled tasks' })
  @ApiResponse({ status: 200, description: 'List of daily scheduled tasks.' })
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DailyScheduledTaskDto>> {
    return this.taskService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a daily scheduled task by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@UUIDParam('id') id: Uuid): Promise<DailyScheduledTaskDto> {
    const scheduledTask = await this.taskService.findOne(id);

    return new DailyScheduledTaskDto(scheduledTask);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a daily scheduled task by ID' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateDto: DailyScheduledTaskCreateDto,
  ): Promise<void> {
    await this.taskService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a daily scheduled task by ID' })
  @ApiResponse({
    status: 204,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async remove(@UUIDParam('id') id: Uuid): Promise<void> {
    const isSuccessful = await this.taskService.remove(id);

    if (!isSuccessful) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
