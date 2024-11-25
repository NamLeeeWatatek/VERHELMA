"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCommentDto = exports.UpdateTaskCommentDto = exports.CreateTaskCommentDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class CreateTaskCommentDto {
    taskId;
    userId;
    comment;
}
exports.CreateTaskCommentDto = CreateTaskCommentDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskCommentDto.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskCommentDto.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskCommentDto.prototype, "comment", void 0);
class UpdateTaskCommentDto {
    comment;
}
exports.UpdateTaskCommentDto = UpdateTaskCommentDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskCommentDto.prototype, "comment", void 0);
class TaskCommentDto {
    id;
    comment;
    taskId;
    user;
    createdAt;
    constructor(comment) {
        this.id = comment.id;
        this.taskId = comment.task.id;
        this.comment = comment.comment;
        this.user = new user_basic_response_dto_1.UserBasicDto(comment.user);
        this.createdAt = comment.createdAt;
    }
}
exports.TaskCommentDto = TaskCommentDto;
//# sourceMappingURL=task-comment.dto.js.map