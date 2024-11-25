"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskBasicDto = void 0;
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class TaskBasicDto {
    id;
    title;
    area;
    assignedUsers;
    project;
    startDate;
    dueDate;
    status;
    constructor(task) {
        this.id = task.id;
        this.title = task.title;
        this.area = task.area;
        this.assignedUsers = task.assignedUsers
            ?.map((user) => (user.user ? new user_basic_response_dto_1.UserBasicDto(user.user) : null))
            .filter((user) => user !== null);
        this.project = task.project;
        this.dueDate = task.dueDate;
        this.startDate = task.startDate;
        this.status = task.status;
    }
}
exports.TaskBasicDto = TaskBasicDto;
//# sourceMappingURL=task-basic.dto.js.map