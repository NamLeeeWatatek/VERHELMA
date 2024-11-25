import type { TaskStatus } from '../../../constants/task-status';
import type { AreaEntity } from '../../area/area.entity';
import type { ProjectEntity } from '../../project/project.entity';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { TaskEntity } from '../task.entity';

export class TaskBasicDto {
  id: Uuid;

  title: string;

  area?: AreaEntity;

  assignedUsers?: UserBasicDto[];

  project?: ProjectEntity;

  startDate?: Date;

  dueDate?: Date;

  status?: TaskStatus;

  constructor(task: TaskEntity) {
    this.id = task.id;
    this.title = task.title;
    this.area = task.area;
    this.assignedUsers = task.assignedUsers
      ?.map((user) => (user.user ? new UserBasicDto(user.user) : null))
      .filter((user) => user !== null);
    this.project = task.project;
    this.dueDate = task.dueDate;
    this.startDate = task.startDate;
    this.status = task.status;
  }
}
