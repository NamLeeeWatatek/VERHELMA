"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const subtask_response_dto_1 = require("../subtask/dtos/subtask.response.dto");
const subtask_create_dto_1 = require("../subtask/dtos/subtask-create.dto");
const user_entity_1 = require("../user/user.entity");
const task_dto_1 = require("./dtos/task.dto");
const task_change_status_dto_1 = require("./dtos/task-change-status.dto");
const task_create_dto_1 = require("./dtos/task-create.dto");
const task_filter_dto_1 = require("./dtos/task-filter.dto");
const task_update_dto_1 = require("./dtos/task-update.dto");
const task_service_1 = require("./task.service");
let TaskController = class TaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async createTask(user, taskCreateDto) {
        const taskEntity = await this.taskService.createTask(taskCreateDto, user);
        return new task_dto_1.TaskDto(taskEntity);
    }
    async getTasks(pageOptionsDto, taskFilterDto) {
        return this.taskService.getTasks(pageOptionsDto, taskFilterDto);
    }
    async getLoggedInUserTasks(user, pageOptionsDto, taskFilterDto) {
        return this.taskService.getLoggedInUserTasks(user, pageOptionsDto, taskFilterDto);
    }
    async getTasksToVerify(user, pageOptionsDto, taskFilterDto) {
        return this.taskService.getTasksToVerify(user, pageOptionsDto, taskFilterDto);
    }
    async getTask(id) {
        return this.taskService.getTask(id);
    }
    async updateTask(id, taskUpdateDto) {
        return this.taskService.updateTask(id, taskUpdateDto);
    }
    async updateTaskStatus(id, updateTaskStatusDto) {
        return this.taskService.updateTaskStatus(id, updateTaskStatusDto.status);
    }
    async deleteTask(id) {
        return this.taskService.deleteTask(id);
    }
    async getTaskByUserId(userId, pageOptionsDto) {
        return this.taskService.getTasksByUserId(userId, pageOptionsDto);
    }
    async createSubtask(taskId, subtaskCreateDto) {
        return this.taskService.createNewSubtask(taskId, subtaskCreateDto.content);
    }
    async changeSubtaskStatus(taskId, subtaskId) {
        await this.taskService.changeSubtaskStatus(taskId, subtaskId);
    }
    async updateSubtask(taskId, subTaskId, subtaskCreateDto) {
        return this.taskService.updateSubtaskContent(taskId, subTaskId, subtaskCreateDto.content);
    }
    async deleteSubtask(taskId, subtaskId) {
        await this.taskService.deleteSubtask(taskId, subtaskId);
    }
    async assignTaskToUsers(taskId, assignedUsers) {
        return this.taskService.assignTaskToUsers(taskId, assignedUsers);
    }
    async getEmployeeLocations(user, taskId) {
        return this.taskService.getEmployeeLocations(user, taskId);
    }
};
exports.TaskController = TaskController;
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Task created successfully',
        type: task_dto_1.TaskDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid task data',
    }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        task_create_dto_1.TaskCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of tasks' }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Retrieve a list of tasks with pagination',
        type: page_dto_1.PageDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid pagination data',
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto,
        task_filter_dto_1.TaskFilterDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getTasks", null);
tslib_1.__decorate([
    (0, common_1.Get)('my-tasks'),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of own tasks' }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__param(2, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        page_options_dto_1.PageOptionsDto,
        task_filter_dto_1.TaskFilterDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getLoggedInUserTasks", null);
tslib_1.__decorate([
    (0, common_1.Get)('to-verify'),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of tasks to verify' }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__param(2, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        page_options_dto_1.PageOptionsDto,
        task_filter_dto_1.TaskFilterDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getTasksToVerify", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get task details by ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task details retrieved successfully',
        type: task_dto_1.TaskDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task not found',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getTask", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update task details' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task updated successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid update data',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, task_update_dto_1.TaskUpdateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
tslib_1.__decorate([
    (0, common_1.Put)('/change-status/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Update task's status" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Changed status successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task not found',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, task_change_status_dto_1.TaskChangeStatusDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "updateTaskStatus", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task by ID' }),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Task deleted successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task not found',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
tslib_1.__decorate([
    (0, common_1.Get)('/user/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks assigned to a user by user ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tasks assigned to the user retrieved successfully',
        type: page_dto_1.PageDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No tasks found for the user',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskByUserId", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(':taskId/sub-task'),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        type: 'string',
        description: 'ID of the task',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sub-task' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Sub-task created successfully',
        type: subtask_response_dto_1.SubTaskResponseDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, subtask_create_dto_1.SubtaskCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "createSubtask", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':taskId/sub-task/:subtaskId/change-status'),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        type: 'string',
        description: 'ID of the task',
    }),
    (0, swagger_1.ApiParam)({
        name: 'subtaskId',
        type: 'string',
        description: 'ID of the sub-task to change its status',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Change a sub-task' status" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Subtask updated successfully',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('subtaskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "changeSubtaskStatus", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(':taskId/sub-task/:subTaskId'),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        type: 'string',
        description: 'ID of the task',
    }),
    (0, swagger_1.ApiParam)({
        name: 'subTaskId',
        type: 'string',
        description: 'ID of the sub-task',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update sub-task content' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('subTaskId')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, subtask_create_dto_1.SubtaskCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "updateSubtask", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':taskId/sub-task/:subtaskId'),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        type: 'string',
        description: 'ID of the task',
    }),
    (0, swagger_1.ApiParam)({
        name: 'subtaskId',
        type: 'string',
        description: 'ID of the subtask',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a sub-task' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('subtaskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "deleteSubtask", null);
tslib_1.__decorate([
    (0, common_1.Post)('assign/:taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a task to multiple users' }),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        type: 'string',
        description: 'ID of the task to assign',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task assigned successfully to users',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task or user(s) not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid task or user data',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "assignTaskToUsers", null);
tslib_1.__decorate([
    (0, common_1.Get)('employee-location/:taskId'),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get location of employees' }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getEmployeeLocations", null);
exports.TaskController = TaskController = tslib_1.__decorate([
    (0, common_1.Controller)('tasks'),
    (0, swagger_1.ApiTags)('tasks'),
    tslib_1.__metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map