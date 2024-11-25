import type { CheckInInfo } from 'modules/check-in/dtos/check-in.info';
import type { TaskBasicDto } from 'modules/task/dtos/task-basic.dto';
import type { UserBasicDto } from 'modules/user/dtos/user-basic.response.dto';

import type { TaskStatus } from '../../../constants/task-status';

export interface IUserTaskReportDto {
  user: UserBasicDto;
  tasks: ITaskReportDto[];
  dailyWorkTime: IDailyWorkTimeDto[];
  totalWorkTime: number;
  completedTasksNumber: number;
}

export interface ITaskReportDto {
  taskInfo: TaskBasicDto;
  checkInInfo: CheckInInfo;
}

export interface IDailyWorkTimeDto {
  date: Date;
  totalMinutesWorked: number;
}

export interface IUserMonthlyReportDto {
  user: UserBasicDto;
  tasksStatistics: {
    [TaskStatus.ToDo]: number;
    [TaskStatus.InProgress]: number;
    [TaskStatus.Done]: number;
    [TaskStatus.Cancelled]: number;
    [TaskStatus.OnHold]: number;
  };
  taskTotal: number;
  totalWorkTime: number;
}
