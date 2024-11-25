"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyScheduledTaskDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const area_dto_1 = require("../../area/dtos/area.dto");
const project_dto_1 = require("../../project/dtos/project.dto");
const subtask_dto_1 = require("../../subtask/dtos/subtask.dto");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class DailyScheduledTaskDto extends abstract_dto_1.AbstractDto {
    title;
    description;
    area;
    assigned_user_ids;
    project;
    priority;
    startDate;
    endDate;
    startTime;
    endTime;
    isCheckInPhotoRequired = true;
    isCheckOutPhotoRequired = true;
    createdBy;
    subtasks;
    constructor(task) {
        super(task);
        this.title = task.title;
        this.description = task.description;
        if (task.area) {
            this.area = new area_dto_1.AreaDto(task.area);
        }
        this.assigned_user_ids = task.assignedUserIds;
        if (task.project) {
            this.project = new project_dto_1.ProjectDto(task.project);
        }
        this.priority = task.priority;
        this.endDate = task.endDate;
        this.startDate = task.startDate;
        this.createdBy = new user_basic_response_dto_1.UserBasicDto(task.createdBy);
        this.isCheckInPhotoRequired = task.isCheckInPhotoRequired;
        this.isCheckOutPhotoRequired = task.isCheckOutPhotoRequired;
        this.subtasks = task.subtasks?.map((st) => new subtask_dto_1.SubtaskDto(st));
    }
}
exports.DailyScheduledTaskDto = DailyScheduledTaskDto;
//# sourceMappingURL=daily-scheduled-tasked.dto.js.map