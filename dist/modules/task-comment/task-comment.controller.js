"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCommentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../decorators");
const task_comment_dto_1 = require("./dtos/task-comment.dto");
const task_comment_service_1 = require("./task-comment.service");
let TaskCommentController = class TaskCommentController {
    taskCommentService;
    constructor(taskCommentService) {
        this.taskCommentService = taskCommentService;
    }
    async createTaskComment(taskCommentCreateDto) {
        const taskCommentEntity = await this.taskCommentService.createComment(taskCommentCreateDto);
        return new task_comment_dto_1.TaskCommentDto(taskCommentEntity);
    }
    async getCommentsByTaskId(taskId) {
        return this.taskCommentService.getCommentsByTaskId(taskId);
    }
    updateTaskComment(id, taskCommentUpdateDto) {
        return this.taskCommentService.updateTaskComment(id, taskCommentUpdateDto);
    }
    async deleteTaskComment(id) {
        await this.taskCommentService.deleteTaskComment(id);
    }
};
exports.TaskCommentController = TaskCommentController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task comment' }),
    (0, swagger_1.ApiCreatedResponse)({ type: task_comment_dto_1.TaskCommentDto }),
    (0, swagger_1.ApiBody)({
        type: task_comment_dto_1.CreateTaskCommentDto,
        description: 'Details of the task comment to be created',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [task_comment_dto_1.CreateTaskCommentDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskCommentController.prototype, "createTaskComment", null);
tslib_1.__decorate([
    (0, common_1.Get)(':taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve comments for a specific task by task ID' }),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task to retrieve comments for',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get comments for the task',
        type: [task_comment_dto_1.TaskCommentDto],
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskCommentController.prototype, "getCommentsByTaskId", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing task comment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the task comment to update' }),
    (0, swagger_1.ApiBody)({
        type: task_comment_dto_1.UpdateTaskCommentDto,
        description: 'Updated task comment data',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Task comment updated successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, task_comment_dto_1.UpdateTaskCommentDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskCommentController.prototype, "updateTaskComment", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific task comment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the task comment to delete' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Task comment deleted successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskCommentController.prototype, "deleteTaskComment", null);
exports.TaskCommentController = TaskCommentController = tslib_1.__decorate([
    (0, common_1.Controller)('task-comments'),
    (0, swagger_1.ApiTags)('task-comments'),
    tslib_1.__metadata("design:paramtypes", [task_comment_service_1.TaskCommentService])
], TaskCommentController);
//# sourceMappingURL=task-comment.controller.js.map