"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const area_entity_1 = require("../area/area.entity");
const daily_scheduled_tasked_entity_1 = require("../daily-scheduled-task/daily-scheduled-tasked.entity");
const notification_entity_1 = require("../notification/notification.entity");
const notification_service_1 = require("../notification/notification.service");
const project_entity_1 = require("../project/project.entity");
const subtask_entity_1 = require("../subtask/subtask.entity");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const user_entity_1 = require("../user/user.entity");
const task_controller_1 = require("./task.controller");
const task_entity_1 = require("./task.entity");
const task_service_1 = require("./task.service");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                task_entity_1.TaskEntity,
                project_entity_1.ProjectEntity,
                area_entity_1.AreaEntity,
                user_entity_1.UserEntity,
                task_assignment_entity_1.TaskAssignmentEntity,
                subtask_entity_1.SubtaskEntity,
                daily_scheduled_tasked_entity_1.DailyScheduledTaskEntity,
                notification_entity_1.NotificationEntity,
            ]),
        ],
        controllers: [task_controller_1.TaskController],
        exports: [task_service_1.TaskService],
        providers: [task_service_1.TaskService, notification_service_1.NotificationService],
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map