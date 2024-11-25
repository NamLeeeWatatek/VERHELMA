"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const area_entity_1 = require("../../area/area.entity");
const project_entity_1 = require("../../project/project.entity");
const subtask_dto_1 = require("../../subtask/dtos/subtask.dto");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class TaskDto extends abstract_dto_1.AbstractDto {
    title;
    description;
    area;
    assignedUsers;
    project;
    priority = 1;
    startDate;
    dueDate;
    createdBy;
    status;
    isCheckInPhotoRequired;
    isCheckOutPhotoRequired;
    subtasks;
    verifier;
    constructor(task) {
        super(task);
        this.title = task.title;
        this.description = task.description;
        this.area = task.area;
        this.assignedUsers = task.assignedUsers
            ?.map((user) => (user.user ? new user_basic_response_dto_1.UserBasicDto(user.user) : null))
            .filter((user) => user !== null);
        this.project = task.project;
        this.priority = task.priority;
        this.dueDate = task.dueDate;
        this.startDate = task.startDate;
        this.createdBy = task.createdBy ? new user_basic_response_dto_1.UserBasicDto(task.createdBy) : null;
        this.status = task.status;
        this.isCheckInPhotoRequired = task.isCheckInPhotoRequired;
        this.isCheckOutPhotoRequired = task.isCheckOutPhotoRequired;
        this.subtasks = task.subtasks?.map((st) => new subtask_dto_1.SubtaskDto(st));
        this.verifier = task.verifier ? new user_basic_response_dto_1.UserBasicDto(task.verifier) : null;
    }
}
exports.TaskDto = TaskDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TaskDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TaskDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", area_entity_1.AreaEntity)
], TaskDto.prototype, "area", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], TaskDto.prototype, "assignedUsers", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", project_entity_1.ProjectEntity)
], TaskDto.prototype, "project", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Number)
], TaskDto.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Date)
], TaskDto.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Date)
], TaskDto.prototype, "dueDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Object)
], TaskDto.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TaskDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], TaskDto.prototype, "isCheckInPhotoRequired", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], TaskDto.prototype, "isCheckOutPhotoRequired", void 0);
//# sourceMappingURL=task.dto.js.map