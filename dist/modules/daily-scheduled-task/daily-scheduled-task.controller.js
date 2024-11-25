"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyScheduledTaskController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const user_entity_1 = require("../user/user.entity");
const daily_scheduled_task_service_1 = require("./daily-scheduled-task.service");
const daily_scheduled_task_create_dto_1 = require("./dtos/daily-scheduled-task-create.dto");
const daily_scheduled_tasked_dto_1 = require("./dtos/daily-scheduled-tasked.dto");
let DailyScheduledTaskController = class DailyScheduledTaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async create(user, createDto) {
        return this.taskService.create(createDto, user);
    }
    async findAll(pageOptionsDto) {
        return this.taskService.findAll(pageOptionsDto);
    }
    async findOne(id) {
        const scheduledTask = await this.taskService.findOne(id);
        return new daily_scheduled_tasked_dto_1.DailyScheduledTaskDto(scheduledTask);
    }
    async update(id, updateDto) {
        await this.taskService.update(id, updateDto);
    }
    async remove(id) {
        const isSuccessful = await this.taskService.remove(id);
        if (!isSuccessful) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
    }
};
exports.DailyScheduledTaskController = DailyScheduledTaskController;
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new daily scheduled task' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The task has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        daily_scheduled_task_create_dto_1.DailyScheduledTaskCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyScheduledTaskController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all daily scheduled tasks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of daily scheduled tasks.' }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyScheduledTaskController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a daily scheduled task by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The task has been successfully retrieved.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyScheduledTaskController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a daily scheduled task by ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The task has been successfully updated.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, daily_scheduled_task_create_dto_1.DailyScheduledTaskCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyScheduledTaskController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a daily scheduled task by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'The task has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyScheduledTaskController.prototype, "remove", null);
exports.DailyScheduledTaskController = DailyScheduledTaskController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('daily-scheduled-tasks'),
    (0, common_1.Controller)('daily-scheduled-tasks'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__metadata("design:paramtypes", [daily_scheduled_task_service_1.DailyScheduledTaskService])
], DailyScheduledTaskController);
//# sourceMappingURL=daily-scheduled-task.controller.js.map