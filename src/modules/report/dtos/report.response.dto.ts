import type { ProjectDto } from 'modules/project/dtos/project.dto';
import type { UserBasicDto } from 'modules/user/dtos/user-basic.response.dto';

import type { TaskBasicDto } from '../../task/dtos/task-basic.dto';

export class UserReportDto {
  doneTasks: TaskBasicDto[] = [];

  inProgressTasks: TaskBasicDto[] = [];

  toDoTasks: TaskBasicDto[] = [];

  onHoldTasks: TaskBasicDto[] = [];

  cancelledTasks: TaskBasicDto[] = [];

  taskTotal = 0;

  totalWorkingTime = 0;

  checkedInTaskCount = 0;

  uncheckedInTaskCount = 0;
}

export class ProjectReportDto {
  projectInfo!: ProjectDto;

  doneTasks: TaskBasicDto[] = [];

  inProgressTasks: TaskBasicDto[] = [];

  toDoTasks: TaskBasicDto[] = [];

  onHoldTasks: TaskBasicDto[] = [];

  cancelledTasks: TaskBasicDto[] = [];

  overdueTasks: TaskBasicDto[] = [];

  taskTotal = 0;

  workingUsers: UserBasicDto[] = [];
}

export class ReportDto {
  doneTasks: TaskBasicDto[] = [];

  inProgressTasks: TaskBasicDto[] = [];

  toDoTasks: TaskBasicDto[] = [];

  onHoldTasks: TaskBasicDto[] = [];

  cancelledTasks: TaskBasicDto[] = [];

  awaitingVerificationTasks: TaskBasicDto[] = [];

  overdueTasks: TaskBasicDto[] = [];
}
