import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { AbstractEntity } from 'common/abstract.entity';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import dayjs from 'dayjs';
import type { TaskCreateDto } from 'modules/task/dtos/task-create.dto';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { PageDto } from '../../common/dto/page.dto';
import { AreaEntity } from '../area/area.entity';
import { CheckInEntity } from '../check-in/check-in.entity';
import { ProjectEntity } from '../project/project.entity';
import { TaskEntity } from '../task/task.entity';
import { TaskService } from '../task/task.service';
import type { UserEntity } from '../user/user.entity';
import { DailyScheduledTaskEntity } from './daily-scheduled-tasked.entity';
import type { DailyScheduledTaskCreateDto } from './dtos/daily-scheduled-task-create.dto';
import { DailyScheduledTaskDto } from './dtos/daily-scheduled-tasked.dto';

@Injectable()
export class DailyScheduledTaskService {
  constructor(
    @InjectRepository(DailyScheduledTaskEntity)
    private dailyScheduledTaskRepository: Repository<DailyScheduledTaskEntity>,

    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,

    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,

    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    private taskService: TaskService,
  ) {}

  private async findEntity<T extends AbstractEntity>(
    repository: Repository<T>,
    id: Uuid,
    notFoundMessage: string,
  ): Promise<T> {
    const entity = await repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });

    if (!entity) {
      throw new NotFoundException(notFoundMessage);
    }

    return entity;
  }

  async create(
    createDto: DailyScheduledTaskCreateDto,
    authUser: UserEntity,
  ): Promise<DailyScheduledTaskEntity> {
    const dailyScheduledTask =
      this.dailyScheduledTaskRepository.create(createDto);

    if (createDto.areaId) {
      dailyScheduledTask.area = await this.findEntity(
        this.areaRepository,
        createDto.areaId,
        'Area not found',
      );
    }

    if (createDto.projectId) {
      dailyScheduledTask.project = await this.findEntity(
        this.projectRepository,
        createDto.projectId,
        'Project not found',
      );
    }

    dailyScheduledTask.createdBy = authUser;

    const savedDailyScheduledTask =
      await this.dailyScheduledTaskRepository.save(dailyScheduledTask);

    const { startDate, endDate, startTime, endTime, ...taskInfo } = createDto;

    const taskStartTime = startTime ?? '00:00:00'; // Default to 00:00:00 if startTime is null
    const taskEndTime = endTime ?? '23:59:59'; // Default to 23:59:59 if endTime is null

    const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day');

    // Create an array of promises for creating tasks for each day in the range
    const taskPromises = Array.from({ length: diffDays + 1 }, (_, i) => {
      // Generate the current start date for the iteration
      const currentStartDate = dayjs(startDate)
        .add(i, 'day')
        .format('YYYY-MM-DD');

      // Construct task start and end dates by combining the date with start and end times
      const taskStartDate = dayjs(
        `${currentStartDate} ${taskStartTime}`,
        'YYYY-MM-DD HH:mm',
      ).toDate();
      const taskEndDate = dayjs(
        `${currentStartDate} ${taskEndTime}`,
        'YYYY-MM-DD HH:mm',
      ).toDate();

      // Create a new TaskCreateDto using destructured taskInfo and add startDate, dueDate, and sourceTaskId
      const taskCreateDto: TaskCreateDto = {
        ...taskInfo,
        startDate: taskStartDate,
        dueDate: taskEndDate,
        sourceTaskId: savedDailyScheduledTask.id,
      };

      return this.taskService.createTask(taskCreateDto, authUser);
    });

    await Promise.all(taskPromises);

    return savedDailyScheduledTask;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DailyScheduledTaskDto>> {
    const queryBuilder =
      this.dailyScheduledTaskRepository.createQueryBuilder('task');

    queryBuilder
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'createdBy');

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    const taskDtos = items.map((task) => new DailyScheduledTaskDto(task));

    return new PageDto<DailyScheduledTaskDto>(taskDtos, pageMetaDto);
  }

  async findOne(id: Uuid): Promise<DailyScheduledTaskEntity> {
    const queryBuilder =
      this.dailyScheduledTaskRepository.createQueryBuilder('task');
    queryBuilder
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('task.id = :id', { id });

    const task = await queryBuilder.getOne();

    if (!task) {
      throw new Error(`DailyScheduledTask with id ${id} not found`);
    }

    return task;
  }

  private async findDailyScheduledTask(
    id: Uuid,
  ): Promise<DailyScheduledTaskEntity> {
    const task = await this.dailyScheduledTaskRepository.findOne({
      where: { id },
      relations: ['dailyTasks', 'createdBy'],
    });

    if (!task) {
      throw new Error('DailyScheduledTask not found');
    }

    return task;
  }

  private async getTasksWithCheckIns(
    dailyScheduledTask: DailyScheduledTaskEntity,
  ) {
    const checkInPromises = dailyScheduledTask.dailyTasks?.map(async (task) => {
      const hasCheckIn = await this.checkInRepository.findOne({
        where: { taskId: task.id },
      });

      return { task, hasCheckIn };
    });

    return Promise.all(checkInPromises ?? []);
  }

  async update(
    id: Uuid,
    updateDto: DailyScheduledTaskCreateDto,
  ): Promise<void> {
    const dailyScheduledTask = await this.findDailyScheduledTask(id);
    let tasksWithCheckIns = await this.getTasksWithCheckIns(dailyScheduledTask);

    const oldStartDate = dailyScheduledTask.startDate;
    const oldEndDate = dailyScheduledTask.endDate;

    if (updateDto.areaId) {
      dailyScheduledTask.area = await this.findEntity(
        this.areaRepository,
        updateDto.areaId,
        'Area not found',
      );
    }

    if (updateDto.projectId) {
      dailyScheduledTask.project = await this.findEntity(
        this.projectRepository,
        updateDto.projectId,
        'Project not found',
      );
    }

    this.dailyScheduledTaskRepository.merge(dailyScheduledTask, updateDto);
    await this.dailyScheduledTaskRepository.save(dailyScheduledTask);

    const newStartDate = updateDto.startDate;
    const newEndDate = updateDto.endDate;

    // Check if startDate or endDate has changed
    if (
      !dayjs(newStartDate).isSame(oldStartDate) ||
      !dayjs(newEndDate).isSame(oldEndDate)
    ) {
      // Filter tasks to find those that are not checked in and not in the new date range
      const tasksToDelete = tasksWithCheckIns
        .filter(
          ({ hasCheckIn }) =>
            // Return true if task has no check-ins
            !hasCheckIn,
        )
        .map(({ task }) => task); // Extract the tasks to delete

      // Delete the filtered tasks
      if (Array.isArray(tasksToDelete) && tasksToDelete.length > 0) {
        await this.taskRepository.remove(tasksToDelete);
      }

      tasksWithCheckIns = tasksWithCheckIns.filter(
        ({ task }) => !tasksToDelete.includes(task),
      );
    }

    const { startDate, endDate, startTime, endTime, ...taskInfo } = updateDto;

    const taskStartTime = startTime ?? '00:00:00'; // Default to 00:00:00 if startTime is null
    const taskEndTime = endTime ?? '23:59:59'; // Default to 23:59:59 if endTime is null

    const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day');

    // Create an array of promises for creating tasks for each day in the range
    const taskPromises = Array.from({ length: diffDays + 1 }, async (_, i) => {
      // Generate the current start date for the iteration
      const currentStartDate = dayjs(startDate)
        .add(i, 'day')
        .format('YYYY-MM-DD');

      // Check if there are tasksWithCheckIns for this current date
      const existingTask = tasksWithCheckIns.find(
        ({ task }) =>
          dayjs(task.startDate).format('YYYY-MM-DD') === currentStartDate,
      );

      // If there is already a task with a check-in for this date, skip creating a new task
      if (existingTask) {
        const task = await this.taskRepository.findOne({
          where: { id: existingTask.task.id },
        });

        if (task) {
          this.taskRepository.merge(task, {
            ...taskInfo,
            startDate: dayjs(`${currentStartDate} ${taskStartTime}`).toDate(),
            dueDate: dayjs(`${currentStartDate} ${taskEndTime}`).toDate(),
          });

          return this.taskRepository.save(existingTask.task);
        }
      }

      // Construct task start and end dates by combining the date with start and end times
      const taskStartDate = dayjs(
        `${currentStartDate} ${taskStartTime}`,
        'YYYY-MM-DD HH:mm',
      ).toDate();
      const taskEndDate = dayjs(
        `${currentStartDate} ${taskEndTime}`,
        'YYYY-MM-DD HH:mm',
      ).toDate();

      // Create a new TaskCreateDto using destructured taskInfo and add startDate, dueDate, and sourceTaskId
      const taskCreateDto: TaskCreateDto = {
        ...taskInfo,
        startDate: taskStartDate,
        dueDate: taskEndDate,
        sourceTaskId: dailyScheduledTask.id,
      };

      return this.taskService.createTask(
        taskCreateDto,
        dailyScheduledTask.createdBy,
      );
    });

    await Promise.all(taskPromises);
    //await this.dailyScheduledTaskRepository.save(dailyScheduledTask);
  }

  async remove(id: Uuid): Promise<boolean> {
    const taskEntity = await this.taskRepository.findOne({
      where: { id },
    });

    if (!taskEntity) {
      return false;
    }

    await this.taskRepository.remove(taskEntity);

    return true;
  }
}
