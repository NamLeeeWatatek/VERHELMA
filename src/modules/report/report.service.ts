import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Role } from '../../constants/role.enum';
import { TaskStatus } from '../../constants/task-status';
import { CheckInEntity } from '../check-in/check-in.entity';
import { CheckInInfo } from '../check-in/dtos/check-in.info';
import { FarmEntity } from '../farm/farm.entity';
import { ProjectDto } from '../project/dtos/project.dto';
import { ProjectEntity } from '../project/project.entity';
import { TaskBasicDto } from '../task/dtos/task-basic.dto';
import { TaskEntity } from '../task/task.entity';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { UserBasicDto } from '../user/dtos/user-basic.response.dto';
import { UserEntity } from '../user/user.entity';
import type {
  IDailyWorkTimeDto,
  ITaskReportDto,
  IUserMonthlyReportDto,
  IUserTaskReportDto,
} from './dtos/report.dto';
import {
  ProjectReportDto,
  ReportDto,
  UserReportDto,
} from './dtos/report.response.dto';
import type { ReportFilterDto } from './dtos/report-filter.dto';
import type { ReportMonthlyCreateDto } from './dtos/report-monthly-create.dto';
import type { ReportRangeCreateDto } from './dtos/report-range-create.dto';

export class ReportService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(TaskAssignmentEntity)
    private readonly taskAssignmentRepository: Repository<TaskAssignmentEntity>,

    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,

    @InjectRepository(FarmEntity)
    private farmRepository: Repository<FarmEntity>,
  ) {}

  async createRangeReport(
    dto: ReportRangeCreateDto,
  ): Promise<IUserTaskReportDto[]> {
    const { startDate, endDate, projectId, userIds } = dto;

    const users = await this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });

    const taskPromises = users.map(async (user) => {
      const tasks = await this.taskRepository.find({
        where: {
          project: projectId ? { id: projectId } : undefined,
          assignedUsers: { userId: user.id },
          startDate: MoreThanOrEqual(new Date(startDate)),
          dueDate: LessThanOrEqual(new Date(endDate)),
        },
        relations: ['assignedUsers', 'project', 'area'],
      });

      const {
        taskReports,
        totalWorkTime,
        completedTasksNumber,
        dailyWorkTime,
      } = await this.processTasks(user.id, tasks);

      return {
        user: new UserBasicDto(user),
        tasks: taskReports,
        dailyWorkTime,
        totalWorkTime,
        completedTasksNumber,
      };
    });

    return Promise.all(taskPromises);
  }

  async createMonthlyReport(
    dto: ReportMonthlyCreateDto,
  ): Promise<IUserMonthlyReportDto[]> {
    const { monthTime, projectId, userIds } = dto;

    const monthDate = new Date(monthTime);

    const year = monthDate.getUTCFullYear();
    const month = monthDate.getUTCMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const users = await this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });

    const taskPromises = users.map(async (user) => {
      const tasks = await this.taskRepository.find({
        where: {
          project: projectId ? { id: projectId } : undefined,
          assignedUsers: { userId: user.id },
          startDate: MoreThanOrEqual(new Date(startDate)),
          dueDate: LessThanOrEqual(new Date(endDate)),
        },
        relations: ['assignedUsers', 'project'],
        select: ['id', 'status'],
      });

      const taskStatusCount = {
        [TaskStatus.ToDo]: 0,
        [TaskStatus.InProgress]: 0,
        [TaskStatus.Done]: 0,
        [TaskStatus.Cancelled]: 0,
        [TaskStatus.OnHold]: 0,
        [TaskStatus.Overdue]: 0,
        [TaskStatus.Verifying]: 0,
      };

      const checkInPromises = tasks.map(async (task) => {
        const checkIns = await this.checkInRepository.find({
          where: { userId: user.id, taskId: task.id },
        });

        const checkInInfos = checkIns.map(
          (checkIn) => new CheckInInfo(checkIn),
        );

        const taskWorkTime = checkInInfos.reduce(
          (sum, checkIn) => sum + checkIn.workDuration,
          0,
        );

        return {
          status: task.status,
          workTime: taskWorkTime,
        };
      });

      const checkInResults = await Promise.all(checkInPromises);

      let totalWorkTime = 0;

      for (const { status, workTime } of checkInResults) {
        taskStatusCount[status]++;
        totalWorkTime += workTime;
      }

      return {
        user: new UserBasicDto(user),
        tasksStatistics: taskStatusCount,
        taskTotal: tasks.length,
        totalWorkTime,
      };
    });

    return Promise.all(taskPromises);
  }

  // Helper function to process tasks and calculate necessary data
  private async processTasks(
    userId: Uuid,
    tasks: TaskEntity[],
  ): Promise<{
    taskReports: ITaskReportDto[];
    totalWorkTime: number;
    completedTasksNumber: number;
    dailyWorkTime: IDailyWorkTimeDto[];
  }> {
    const taskReports: ITaskReportDto[] = [];
    const dailyWorkTimeMap: Record<string, number> = {};
    let completedTasksNumber = 0;

    const checkInPromises = tasks.map(async (task) => {
      const checkIns = await this.checkInRepository.find({
        where: { userId, taskId: task.id },
      });

      this.processCheckIns(checkIns, task, taskReports, dailyWorkTimeMap);

      if (task.status === TaskStatus.Done) {
        completedTasksNumber++;
      }
    });

    await Promise.all(checkInPromises);

    const dailyWorkTime = Object.keys(dailyWorkTimeMap).map((dateString) => ({
      date: new Date(dateString),
      totalMinutesWorked: dailyWorkTimeMap[dateString] ?? 0,
    }));

    const totalWorkTime = dailyWorkTime.reduce(
      (sum, workTime) => sum + workTime.totalMinutesWorked,
      0,
    );

    return { taskReports, totalWorkTime, completedTasksNumber, dailyWorkTime };
  }

  // Helper function to process check-ins for each task
  private processCheckIns(
    checkIns: CheckInEntity[],
    task: TaskEntity,
    taskReports: ITaskReportDto[],
    dailyWorkTimeMap: Record<string, number>,
  ): void {
    for (const checkIn of checkIns) {
      const checkInInfo = new CheckInInfo(checkIn);
      const checkInDate = checkInInfo.checkInTime?.toISOString().split('T')[0];

      if (checkInDate) {
        dailyWorkTimeMap[checkInDate] =
          (dailyWorkTimeMap[checkInDate] ?? 0) + checkInInfo.workDuration;
      }

      taskReports.push({
        taskInfo: new TaskBasicDto(task),
        checkInInfo,
      });
    }
  }

  async generateUserReport(
    userId: Uuid,
    startDate: Date,
    endDate: Date,
  ): Promise<UserReportDto> {
    const tasks = await this.taskRepository.find({
      where: {
        assignedUsers: { userId },
        startDate: MoreThanOrEqual(new Date(startDate)),
        dueDate: LessThanOrEqual(new Date(endDate)),
      },
      relations: ['assignedUsers'],
    });

    const taskClassification: { [key in TaskStatus]: TaskBasicDto[] } = {
      [TaskStatus.ToDo]: [],
      [TaskStatus.InProgress]: [],
      [TaskStatus.Done]: [],
      [TaskStatus.Cancelled]: [],
      [TaskStatus.OnHold]: [],
      [TaskStatus.Overdue]: [],
      [TaskStatus.Verifying]: [],
    };

    let checkedInTaskCount = 0;
    let uncheckedInTaskCount = 0;

    const checkInPromises = tasks.map(async (task) => {
      const taskDto = new TaskBasicDto(task);

      if (
        task.dueDate &&
        task.dueDate.getTime() < Date.now() &&
        task.status !== TaskStatus.Done
      ) {
        taskClassification[TaskStatus.Overdue].push(taskDto);
      } else {
        taskClassification[task.status].push(taskDto);
      }

      const checkIn = await this.checkInRepository.findOne({
        where: { userId, taskId: task.id },
      });

      if (checkIn) {
        checkedInTaskCount++;
        const checkInInfo = new CheckInInfo(checkIn);

        return checkInInfo.workDuration;
      }

      uncheckedInTaskCount++;

      return 0;
    });

    const checkInResults = await Promise.all(checkInPromises);

    let totalWorkTime = 0;

    for (const workTime of checkInResults) {
      totalWorkTime += workTime;
    }

    const result = new UserReportDto();

    result.doneTasks = taskClassification[TaskStatus.Done];
    result.inProgressTasks = taskClassification[TaskStatus.InProgress];
    result.toDoTasks = taskClassification[TaskStatus.ToDo];
    result.onHoldTasks = taskClassification[TaskStatus.OnHold];
    result.cancelledTasks = taskClassification[TaskStatus.Cancelled];
    result.taskTotal = tasks.length;
    result.totalWorkingTime = totalWorkTime;
    result.checkedInTaskCount = checkedInTaskCount;
    result.uncheckedInTaskCount = uncheckedInTaskCount;

    return result;
  }

  async generateProjectReport(projectId: Uuid): Promise<ProjectReportDto> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.farm', 'farm')
      .leftJoinAndSelect('project.users', 'users')
      .leftJoinAndSelect('users.user', 'user')
      .where('project.id = :projectId', {
        projectId,
      });

    const project = await queryBuilder.getOne();

    if (!project) {
      throw new NotFoundException('Project not found!');
    }

    const result = new ProjectReportDto();

    result.projectInfo = new ProjectDto(project);

    const taskClassification: { [key in TaskStatus]: TaskBasicDto[] } = {
      [TaskStatus.ToDo]: [],
      [TaskStatus.InProgress]: [],
      [TaskStatus.Done]: [],
      [TaskStatus.Cancelled]: [],
      [TaskStatus.OnHold]: [],
      [TaskStatus.Overdue]: [],
      [TaskStatus.Verifying]: [],
    };

    const allTasks = await this.taskRepository.find({
      where: {
        project: { id: projectId },
      },
      relations: ['project'],
    });

    for (const task of allTasks) {
      const taskDto = new TaskBasicDto(task);

      if (
        task.dueDate &&
        task.dueDate.getTime() < Date.now() &&
        task.status !== TaskStatus.Done
      ) {
        taskClassification[TaskStatus.Overdue].push(taskDto);
      } else {
        taskClassification[task.status].push(taskDto);
      }
    }

    result.workingUsers = project.users.map(
      (user) => new UserBasicDto(user.user),
    );

    result.doneTasks = taskClassification[TaskStatus.Done];
    result.inProgressTasks = taskClassification[TaskStatus.InProgress];
    result.toDoTasks = taskClassification[TaskStatus.ToDo];
    result.onHoldTasks = taskClassification[TaskStatus.OnHold];
    result.cancelledTasks = taskClassification[TaskStatus.Cancelled];
    result.overdueTasks = taskClassification[TaskStatus.Overdue];

    return result;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async generateReport(
    requester: UserEntity,
    reportFilter: ReportFilterDto,
  ): Promise<ReportDto> {
    if (!requester.role) {
      throw new Error("Haven't logged in yet.");
    }

    console.log("requester.role.name: ", requester.role.name);
    console.log("Role.FARM_MANAGER.toString(): ", Role.FARM_MANAGER.toString());
    console.log("result: ",requester.role.name === Role.FARM_MANAGER.toString() )


    if (
      requester.role.name !== Role.SUPERVISOR.toString() &&
      requester.role.name !== Role.FARM_MANAGER.toString()
    ) {
      throw new Error("Don't have permission with your role.");
    }

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('project.farm', 'farm')
      .leftJoinAndSelect('task.area', 'area');

    const farm = await this.farmRepository.findOne({
      where: { id: reportFilter.farmId },
      relations: ['farmManager'],
    });

    if (!farm) {
      throw new BadRequestException('Not exist farm!');
    }

    // if (
    //   requester.role.name === Role.FARM_MANAGER.toString() &&
    //   reportFilter.farmId &&
    //   farm.farmManager &&
    //   farm.farmManager.id !== requester.id
    // ) {
    //   throw new BadRequestException(
    //     "You dont't have permission to access this farm report!",
    //   );
    // }

    queryBuilder.andWhere('farm.id = :farmId', {
      farmId: reportFilter.farmId,
    });

    if (reportFilter.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: reportFilter.projectId },
        relations: ['farm'],
      });

      if (!project) {
        throw new BadRequestException('Not exist project!');
      }

      if (project.farm.id !== reportFilter.farmId) {
        throw new BadRequestException("This project doesn't belong to farm !");
      }

      queryBuilder.andWhere('project.id = :projectId', {
        projectId: reportFilter.projectId,
      });
    }

    if (reportFilter.areaId) {
      // add relation between area and farm, then check later...

      queryBuilder.andWhere('area.id = :areaId', {
        areaId: reportFilter.areaId,
      });
    }

    if (reportFilter.userId) {
      queryBuilder
        .innerJoin('task.assignedUsers', 'assignedUsers')
        .andWhere('assignedUsers.userId = :userId', {
          userId: reportFilter.userId,
        });
    }

    if (
      (reportFilter.startDate && !reportFilter.endDate) ??
      (!reportFilter.startDate && reportFilter.endDate)
    ) {
      throw new BadRequestException('Invalid range time!');
    }

    if (reportFilter.startDate && reportFilter.endDate) {
      queryBuilder.andWhere('task.startDate BETWEEN :startDate AND :endDate', {
        startDate: reportFilter.startDate,
        endDate: reportFilter.endDate,
      });
    }

    const allTasks = await queryBuilder.getMany();

    const taskClassification: { [key in TaskStatus]: TaskBasicDto[] } = {
      [TaskStatus.ToDo]: [],
      [TaskStatus.InProgress]: [],
      [TaskStatus.Done]: [],
      [TaskStatus.Cancelled]: [],
      [TaskStatus.OnHold]: [],
      [TaskStatus.Overdue]: [],
      [TaskStatus.Verifying]: [],
    };

    for (const task of allTasks) {
      const taskDto = new TaskBasicDto(task);

      if (
        task.dueDate &&
        task.dueDate.getTime() < Date.now() &&
        task.status !== TaskStatus.Done
      ) {
        taskClassification[TaskStatus.Overdue].push(taskDto);
      } else {
        taskClassification[task.status].push(taskDto);
      }
    }

    const result = new ReportDto();

    result.doneTasks = taskClassification[TaskStatus.Done];
    result.inProgressTasks = taskClassification[TaskStatus.InProgress];
    result.toDoTasks = taskClassification[TaskStatus.ToDo];
    result.onHoldTasks = taskClassification[TaskStatus.OnHold];
    result.cancelledTasks = taskClassification[TaskStatus.Cancelled];
    result.awaitingVerificationTasks = taskClassification[TaskStatus.Verifying];
    result.overdueTasks = taskClassification[TaskStatus.Overdue];

    return result;
  }
}
