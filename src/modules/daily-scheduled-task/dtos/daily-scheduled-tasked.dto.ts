import type { SubtaskEntity } from 'modules/subtask/subtask.entity';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AreaDto } from '../../area/dtos/area.dto';
import { ProjectDto } from '../../project/dtos/project.dto';
import { SubtaskDto } from '../../subtask/dtos/subtask.dto';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { DailyScheduledTaskEntity } from '../daily-scheduled-tasked.entity';

export class DailyScheduledTaskDto extends AbstractDto {
  title!: string;

  description?: string;

  area?: AreaDto;

  assigned_user_ids?: Uuid[];

  project?: ProjectDto;

  priority?: number;

  startDate?: Date;

  endDate?: Date;

  startTime?: string;

  endTime?: string;

  isCheckInPhotoRequired?: boolean = true;

  isCheckOutPhotoRequired?: boolean = true;

  createdBy: UserBasicDto;

  subtasks?: SubtaskDto[];

  constructor(task: DailyScheduledTaskEntity) {
    super(task);
    this.title = task.title;
    this.description = task.description;

    if (task.area) {
      this.area = new AreaDto(task.area);
    }

    this.assigned_user_ids = task.assignedUserIds;

    if (task.project) {
      this.project = new ProjectDto(task.project);
    }

    this.priority = task.priority;
    this.endDate = task.endDate;
    this.startDate = task.startDate;
    this.createdBy = new UserBasicDto(task.createdBy);
    this.isCheckInPhotoRequired = task.isCheckInPhotoRequired;
    this.isCheckOutPhotoRequired = task.isCheckOutPhotoRequired;
    this.subtasks = task.subtasks?.map(
      (st: SubtaskEntity) => new SubtaskDto(st),
    );
  }
}
