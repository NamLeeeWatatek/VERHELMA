/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable max-params */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';

import type { AbstractEntity } from '../../common/abstract.entity';
import { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { applySorting } from '../../common/utils';
import { NotificationType } from '../../constants/notification-type.enum';
import { Role } from '../../constants/role.enum';
import { TaskStatus } from '../../constants/task-status';
import { FirebaseCloudMessagingService } from '../../shared/services/firebase-cloud-messaging.service';
import { AreaEntity } from '../area/area.entity';
import { DailyScheduledTaskEntity } from '../daily-scheduled-task/daily-scheduled-tasked.entity';
import { NotificationCreateDto } from '../notification/dtos/notification-create.dto';
import { NotificationService } from '../notification/notification.service';
import { ProjectEntity } from '../project/project.entity';
import { SubtaskEntity } from '../subtask/subtask.entity';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { UserEntity } from '../user/user.entity';
import { EmployeeLocationDto } from './dtos/employee-location.response.dto';
import { TaskDto } from './dtos/task.dto';
import type { TaskCreateDto } from './dtos/task-create.dto';
import type { TaskFilterDto } from './dtos/task-filter.dto';
import type { TaskUpdateDto } from './dtos/task-update.dto';
import { SubtaskNotFoundException } from './exceptions/subtask-not-found-exception';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(TaskAssignmentEntity)
    private readonly taskAssignmentRepository: Repository<TaskAssignmentEntity>,

    @InjectRepository(DailyScheduledTaskEntity)
    private readonly dailyScheduledTaskRepository: Repository<DailyScheduledTaskEntity>,

    @InjectRepository(SubtaskEntity)
    private readonly subtaskRepository: Repository<SubtaskEntity>,

    private firebaseCloudMessagingService: FirebaseCloudMessagingService,

    private notificationService: NotificationService,
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

  async createTask(
    taskCreateDto: TaskCreateDto,
    authUser: UserEntity,
  ): Promise<TaskEntity> {
    const task = this.taskRepository.create({
      title: taskCreateDto.title,
      description: taskCreateDto.description,
      priority: taskCreateDto.priority,
      startDate: taskCreateDto.startDate,
      dueDate: taskCreateDto.dueDate,
      createdBy: authUser,
      status: taskCreateDto.status,
      isCheckInPhotoRequired: taskCreateDto.isCheckInPhotoRequired,
      isCheckOutPhotoRequired: taskCreateDto.isCheckOutPhotoRequired,
    });

    if (taskCreateDto.sourceTaskId) {
      task.sourceTask = await this.findEntity(
        this.dailyScheduledTaskRepository,
        taskCreateDto.sourceTaskId,
        'Source task not found',
      );
    }

    if (taskCreateDto.areaId) {
      task.area = await this.findEntity(
        this.areaRepository,
        taskCreateDto.areaId,
        'Area not found',
      );
    }

    if (taskCreateDto.projectId) {
      task.project = await this.findEntity(
        this.projectRepository,
        taskCreateDto.projectId,
        'Project not found',
      );
    }

    if (taskCreateDto.verifierId) {
      const verifier = await this.userRepository.findOne({
        where: {
          id: taskCreateDto.verifierId,
          role: { name: Role.SUPERVISOR },
        },
        relations: ['role'],
      });

      if (!verifier) {
        throw new BadRequestException('Verifier not found!');
      }

      task.verifier = verifier;
    }

    await this.taskRepository.save(task);

    if (
      taskCreateDto.assignedUserIds &&
      taskCreateDto.assignedUserIds.length > 0
    ) {
      // Add new task assignments
      task.assignedUsers = await Promise.all(
        taskCreateDto.assignedUserIds.map(async (userId) => {
          const user = await this.findEntity(
            this.userRepository,
            userId,
            'User not found when assigning',
          );

          // Create a new task assignment entity for each user
          const taskAssignment = new TaskAssignmentEntity();
          taskAssignment.userId = user.id;
          taskAssignment.taskId = task.id;

          taskAssignment.user = user;

          return this.taskAssignmentRepository.save(taskAssignment);
        }),
      );

      const assignedDeviceTokens = task.assignedUsers
        .map((assignedUser) => assignedUser.user?.deviceToken)
        .filter((token) => token !== undefined && token !== null);

      if (assignedDeviceTokens.length > 0) {
        await this.firebaseCloudMessagingService.subscribeMultipleToTopic(
          assignedDeviceTokens,
          task.id,
        );
      }

      await this.firebaseCloudMessagingService.sendNotificationToTopic(
        task.id,
        'You have just assigned to a new task',
        task.title,
      );

      const assignedUserIds = task.assignedUsers
        .map((assignedUser) => assignedUser.user?.id)
        .filter((token) => token !== undefined);

      const notificationDto = new NotificationCreateDto();
      notificationDto.title = `You have just been asssigned into task ${task.title}`;
      notificationDto.body = task.id;
      notificationDto.type = NotificationType.CREATE_TASK;

      await this.notificationService.createNotificationForManyUsers(
        assignedUserIds,
        notificationDto,
      );
    }

    let subtasks: SubtaskEntity[] = [];

    // create subtasks
    if (
      taskCreateDto.subtaskContents &&
      taskCreateDto.subtaskContents.length > 0
    ) {
      subtasks = await Promise.all(
        taskCreateDto.subtaskContents.map(async (subtaskContent) => {
          const subtask = this.subtaskRepository.create({
            content: subtaskContent,
            parentTask: task,
          });

          return this.subtaskRepository.save(subtask);
        }),
      );
    }

    task.subtasks = subtasks;

    return task;
  }

  async getTasks(
    pageOptionsDto: PageOptionsDto,
    filterDto: TaskFilterDto,
  ): Promise<PageDto<TaskDto>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder
      .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('assignedUsers.user', 'user')
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.verifier', 'verifier')
      .orderBy('task.createdAt', 'DESC');

    const allowedSortColumns = [
      'createdAt',
      'title',
      'startDate',
      'dueDate',
      'status',
      'priority',
    ];

    if (pageOptionsDto.orderBy === 'area') {
      queryBuilder.orderBy('area.name', pageOptionsDto.order || 'ASC');
    } else if (pageOptionsDto.orderBy === 'project') {
      queryBuilder.orderBy('project.name', pageOptionsDto.order || 'ASC');
    } else {
      applySorting(queryBuilder, pageOptionsDto, 'task', allowedSortColumns);
    }

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(task.title) LIKE :title', {
        title: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    this.applyFilters(queryBuilder, filterDto);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    const taskDtos = items.map((task) => new TaskDto(task));

    return new PageDto<TaskDto>(taskDtos, pageMetaDto);
  }

  async getLoggedInUserTasks(
    user: UserEntity,
    pageOptionsDto: PageOptionsDto,
    filterDto: TaskFilterDto,
  ): Promise<PageDto<TaskDto>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder
      .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('assignedUsers.user', 'user')
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.verifier', 'verifier')
      .orderBy('task.createdAt', 'DESC')
      .where('user.id = :userId', { userId: user.id });

    const allowedSortColumns = [
      'createdAt',
      'title',
      'startDate',
      'dueDate',
      'status',
      'priority',
    ];

    if (pageOptionsDto.orderBy === 'area') {
      queryBuilder.orderBy('area.name', pageOptionsDto.order || 'ASC');
    } else if (pageOptionsDto.orderBy === 'project') {
      queryBuilder.orderBy('project.name', pageOptionsDto.order || 'ASC');
    } else {
      applySorting(queryBuilder, pageOptionsDto, 'task', allowedSortColumns);
    }

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(task.title) LIKE :title', {
        title: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    this.applyFilters(queryBuilder, filterDto);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    const taskDtos = items.map((task) => new TaskDto(task));

    return new PageDto<TaskDto>(taskDtos, pageMetaDto);
  }

  async getTasksToVerify(
    user: UserEntity,
    pageOptionsDto: PageOptionsDto,
    filterDto: TaskFilterDto,
  ): Promise<PageDto<TaskDto>> {
    if (!user.role || user.role.name !== Role.SUPERVISOR.toString()) {
      throw new BadRequestException('User is not a supervisor');
    }

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder
      .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('assignedUsers.user', 'user')
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.verifier', 'verifier')
      .where('verifier.id = :verifierId', { verifierId: user.id })
      .orderBy('task.createdAt', 'DESC');

    const allowedSortColumns = [
      'createdAt',
      'title',
      'startDate',
      'dueDate',
      'status',
      'priority',
    ];

    if (pageOptionsDto.orderBy === 'area') {
      queryBuilder.orderBy('area.name', pageOptionsDto.order || 'ASC');
    } else if (pageOptionsDto.orderBy === 'project') {
      queryBuilder.orderBy('project.name', pageOptionsDto.order || 'ASC');
    } else {
      applySorting(queryBuilder, pageOptionsDto, 'task', allowedSortColumns);
    }

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(task.title) LIKE :title', {
        title: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    this.applyFilters(queryBuilder, filterDto);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    const taskDtos = items.map((task) => new TaskDto(task));

    return new PageDto<TaskDto>(taskDtos, pageMetaDto);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private applyFilters(
    query: SelectQueryBuilder<TaskEntity>,
    filterDto: TaskFilterDto,
  ) {
    const {
      status,
      priority,
      startDateRange,
      dueDateRange,
      isCheckInPhotoRequired,
      isCheckOutPhotoRequired,
      projectId,
      areaId,
    } = filterDto;

    if (status) {
      if (status === TaskStatus.Overdue) {
        query.andWhere(
          `(task.dueDate IS NOT NULL AND DATE(task.dueDate) < DATE(:currentDate) AND task.status != :doneStatus)`,
          {
            currentDate: new Date(),
            doneStatus: TaskStatus.Done,
          },
        );
      } else {
        query.andWhere('task.status = :status', { status });
      }
    }

    if (priority) {
      query.andWhere('task.priority = :priority', { priority });
    }

    // if (startDateRange && dueDateRange && startDateRange[0] > dueDateRange[1]) {
    //   throw new BadRequestException(
    //     'The start date range cannot be later than the end date range.',
    //   );
    // }

    if (startDateRange) {
      if (startDateRange.length > 2) {
        throw new BadRequestException('StartDate range time is invalid!');
      }

      let start, end: Date;

      if (startDateRange.length === 1) {
        start = new Date(`${startDateRange[0]}T00:00:00.000Z`);
        end = new Date(`${startDateRange[0]}T23:59:59.999Z`);
      } else {
        start = new Date(`${startDateRange[0]}T00:00:00.000Z`);
        end = new Date(`${startDateRange[1]}T23:59:59.999Z`);
      }

      query.andWhere('task.startDate BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    if (dueDateRange) {
      if (dueDateRange.length > 2) {
        throw new BadRequestException('DueDate range time is invalid!');
      }

      let start, end: Date;

      if (dueDateRange.length === 1) {
        start = new Date(`${dueDateRange[0]}T00:00:00.000Z`);
        end = new Date(`${dueDateRange[0]}T23:59:59.999Z`);
      } else {
        start = new Date(`${dueDateRange[0]}T00:00:00.000Z`);
        end = new Date(`${dueDateRange[1]}T23:59:59.999Z`);
      }

      query.andWhere('task.dueDate BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    if (isCheckInPhotoRequired !== undefined) {
      query.andWhere('task.isCheckInPhotoRequired = :isCheckInPhotoRequired', {
        isCheckInPhotoRequired,
      });
    }

    if (isCheckOutPhotoRequired !== undefined) {
      query.andWhere(
        'task.isCheckOutPhotoRequired = :isCheckOutPhotoRequired',
        { isCheckOutPhotoRequired },
      );
    }

    if (projectId) {
      query.andWhere('task.project.id = :projectId', { projectId });
    }

    if (areaId) {
      query.andWhere('task.area.id = :areaId', { areaId });
    }

    return query;
  }

  async getTask(taskId: string): Promise<TaskDto> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('assignedUsers.user', 'user')
      .leftJoinAndSelect('task.verifier', 'verifier')
      .where('task.id = :taskId', { taskId });

    const taskEntity = await queryBuilder.getOne();

    if (!taskEntity) {
      throw new NotFoundException('Task not found');
    }

    return new TaskDto(taskEntity);
  }

  async updateTask(taskId: Uuid, taskUpdateDto: TaskUpdateDto): Promise<void> {
    const taskEntity = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!taskEntity) {
      throw new TaskNotFoundException();
    }

    this.updateTaskProperties(taskEntity, taskUpdateDto);
    await this.updateRelatedEntities(taskEntity, taskUpdateDto);
  }

  private updateTaskProperties(
    taskEntity: TaskEntity,
    taskUpdateDto: TaskCreateDto,
  ): void {
    taskEntity.title = taskUpdateDto.title;
    taskEntity.description = taskUpdateDto.description;
    taskEntity.priority = taskUpdateDto.priority;
    taskEntity.startDate = taskUpdateDto.startDate;
    taskEntity.dueDate = taskUpdateDto.dueDate;
    taskEntity.status = taskUpdateDto.status ?? TaskStatus.ToDo;
    taskEntity.isCheckInPhotoRequired = taskUpdateDto.isCheckInPhotoRequired;
    taskEntity.isCheckOutPhotoRequired = taskUpdateDto.isCheckOutPhotoRequired;
  }

  private async updateRelatedEntities(
    task: TaskEntity,
    taskUpdateDto: TaskCreateDto,
  ): Promise<void> {
    if (taskUpdateDto.areaId) {
      task.area = await this.findEntity(
        this.areaRepository,
        taskUpdateDto.areaId,
        'Area not found',
      );
    }

    if (taskUpdateDto.projectId) {
      task.project = await this.findEntity(
        this.projectRepository,
        taskUpdateDto.projectId,
        'Project not found',
      );
    }

    if (taskUpdateDto.verifierId) {
      const verifier = await this.userRepository.findOne({
        where: {
          id: taskUpdateDto.verifierId,
          role: { name: Role.SUPERVISOR },
        },
        relations: ['role'],
      });

      if (!verifier) {
        throw new BadRequestException('Verifier not found!');
      }

      task.verifier = verifier;
    }

    await this.taskRepository.save(task);

    if (
      taskUpdateDto.assignedUserIds &&
      taskUpdateDto.assignedUserIds.length > 0
    ) {
      const currentAssignments = await this.taskAssignmentRepository.find({
        where: { taskId: task.id },
        relations: ['user'],
      });

      const unsubscribedDeviceTokens = currentAssignments
        .filter(
          (assignment) =>
            !taskUpdateDto.assignedUserIds!.includes(assignment.userId),
        )
        .map((assignment) => assignment.user?.deviceToken)
        .filter(
          (token): token is string => token !== undefined && token !== null,
        );

      if (unsubscribedDeviceTokens.length > 0) {
        await this.firebaseCloudMessagingService.unsubscribeMultipleToTopic(
          unsubscribedDeviceTokens,
          task.id,
        );
      }

      // Remove unassigned tasks
      if (currentAssignments.length > 0) {
        await this.taskAssignmentRepository.remove(
          currentAssignments.filter(
            (assignment) =>
              !taskUpdateDto.assignedUserIds?.includes(assignment.userId),
          ),
        );
      }

      const newAssignedDeviceTokens: string[] = [];
      const newAssignedUserIds: Uuid[] = [];

      const currentUserIds = new Set(
        currentAssignments.map((assignment) => assignment.userId),
      );

      // Add new task assignments if assignedUserIds is not empty
      task.assignedUsers = await Promise.all(
        taskUpdateDto.assignedUserIds
          .filter((userId) => !currentUserIds.has(userId))
          .map(async (id) => {
            const user = await this.findEntity(
              this.userRepository,
              id,
              'User not found when assigning',
            );

            // Create and save new task assignment entity for each user
            const taskAssignment = new TaskAssignmentEntity();
            taskAssignment.user = user;
            taskAssignment.task = task;

            if (user.deviceToken) {
              newAssignedDeviceTokens.push(user.deviceToken);
            }

            newAssignedUserIds.push(user.id);

            return this.taskAssignmentRepository.save(taskAssignment);
          }),
      );

      await this.notifyNewAssignments(
        task,
        newAssignedDeviceTokens,
        newAssignedUserIds,
      );
    }
  }

  async notifyNewAssignments(
    task: TaskEntity,
    newAssignedDeviceTokens: string[],
    newAssignedUserIds: Uuid[],
  ) {
    if (newAssignedDeviceTokens.length > 0) {
      await this.firebaseCloudMessagingService.subscribeMultipleToTopic(
        newAssignedDeviceTokens,
        task.id,
      );

      await this.firebaseCloudMessagingService.sendNotificationToDevices(
        newAssignedDeviceTokens,
        'You are assigned to a new task',
        task.title,
      );
    }

    if (newAssignedUserIds.length > 0) {
      const notificationDto = new NotificationCreateDto();
      notificationDto.title = `You have been just asssigned into task ${task.title}`;
      notificationDto.body = task.id;
      notificationDto.type = NotificationType.UPDATE_TASK;

      await this.notificationService.createNotificationForManyUsers(
        newAssignedUserIds,
        notificationDto,
      );
    }
  }

  async updateTaskStatus(taskId: Uuid, taskStatus: TaskStatus): Promise<void> {
    const taskEntity = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['verifier'],
    });

    if (!taskEntity) {
      throw new TaskNotFoundException();
    }

    if (taskStatus === TaskStatus.Verifying && !taskEntity.verifier) {
      throw new BadRequestException("This task doesn't have verifier!");
    }

    taskEntity.status = taskStatus;

    await this.taskRepository.save(taskEntity);
  }

  async deleteTask(taskId: Uuid): Promise<void> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .where('task.id = :id', { id: taskId });

    const taskEntity = await queryBuilder.getOne();

    if (!taskEntity) {
      throw new TaskNotFoundException();
    }

    await this.taskRepository.remove(taskEntity);
  }

  async getTasksByUserId(
    userId: Uuid,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TaskDto>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder
      .leftJoinAndSelect('task.area', 'area')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .leftJoinAndSelect('task.verifier', 'verifier')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('assignedUsers.user', 'user')
      .where('user.id = :userId', { userId });

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
    const taskDtos = items.map((task) => new TaskDto(task));

    return new PageDto<TaskDto>(taskDtos, pageMetaDto);
  }

  async assignTaskToUsers(taskId: Uuid, userIds: Uuid[]): Promise<void> {
    const taskEntity = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!taskEntity) {
      throw new TaskNotFoundException();
    }

    // Find all current task assignments
    const currentAssignments = await this.taskAssignmentRepository.find({
      where: { taskId },
    });

    // Remove old task assignments if any exist
    if (currentAssignments.length > 0) {
      await this.taskAssignmentRepository.remove(currentAssignments);
    }

    // Add new task assignments
    taskEntity.assignedUsers = await Promise.all(
      userIds.map(async (userId) => {
        const user = await this.findEntity(
          this.userRepository,
          userId,
          'User not found when assigning',
        );

        // Create a new task assignment entity for each user
        const taskAssignment = new TaskAssignmentEntity();
        taskAssignment.user = user;
        taskAssignment.task = taskEntity;

        return this.taskAssignmentRepository.save(taskAssignment);
      }),
    );
  }

  async updateSubtaskContent(
    taskId: Uuid,
    subTaskId: Uuid,
    updateContent: string,
  ): Promise<SubtaskEntity> {
    const subtask = await this.subtaskRepository.findOne({
      where: { id: subTaskId, parentTask: { id: taskId } },
    });

    if (!subtask) {
      throw new SubtaskNotFoundException();
    }

    subtask.content = updateContent;

    return this.subtaskRepository.save(subtask);
  }

  async changeSubtaskStatus(taskId: Uuid, subtaskId: Uuid): Promise<void> {
    const subtask = await this.subtaskRepository.findOne({
      where: { id: subtaskId, parentTask: { id: taskId } },
    });

    if (!subtask) {
      throw new SubtaskNotFoundException();
    }

    subtask.isCompleted = !subtask.isCompleted;

    await this.subtaskRepository.save(subtask);
  }

  async deleteSubtask(taskId: Uuid, subtaskId: Uuid): Promise<void> {
    const subtask = await this.subtaskRepository.findOne({
      where: { id: subtaskId, parentTask: { id: taskId } },
    });

    if (!subtask) {
      throw new SubtaskNotFoundException();
    }

    await this.subtaskRepository.remove(subtask);
  }

  async createNewSubtask(
    taskId: Uuid,
    subtaskContent: string,
  ): Promise<SubtaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Parent task not found');
    }

    const subtask = this.subtaskRepository.create({
      content: subtaskContent,
      isCompleted: false,
      parentTask: task,
    });

    return this.subtaskRepository.save(subtask);
  }

  async getEmployeeLocations(
    user: UserEntity,
    taskId: Uuid,
  ): Promise<EmployeeLocationDto[]> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['createdBy', 'assignedUsers'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.createdBy?.id !== user.id) {
      throw new Error(
        "User does not have permission to access this task's locations",
      );
    }

    const locations: EmployeeLocationDto[] = [];

    if (task.assignedUsers && task.assignedUsers.length > 0) {
      const userPromises = task.assignedUsers.map(async (assignment) => {
        const userEntity = await this.userRepository.findOne({
          where: { id: assignment.userId },
        });

        if (!userEntity) {
          throw new Error(
            `Assigned user not found for userId: ${assignment.userId}`,
          );
        }

        return new EmployeeLocationDto(userEntity);
      });

      try {
        const results = await Promise.all(userPromises);
        locations.push(...results);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new Error('Error retrieving assigned users: ' + error.message);
      }
    }

    return locations;
  }
}
