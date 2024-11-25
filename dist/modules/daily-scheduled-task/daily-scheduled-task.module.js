"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyScheduledTaskModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const area_entity_1 = require("../area/area.entity");
const check_in_entity_1 = require("../check-in/check-in.entity");
const project_entity_1 = require("../project/project.entity");
const subtask_entity_1 = require("../subtask/subtask.entity");
const task_entity_1 = require("../task/task.entity");
const task_module_1 = require("../task/task.module");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const user_entity_1 = require("../user/user.entity");
const daily_scheduled_task_controller_1 = require("./daily-scheduled-task.controller");
const daily_scheduled_task_service_1 = require("./daily-scheduled-task.service");
const daily_scheduled_tasked_entity_1 = require("./daily-scheduled-tasked.entity");
let DailyScheduledTaskModule = class DailyScheduledTaskModule {
};
exports.DailyScheduledTaskModule = DailyScheduledTaskModule;
exports.DailyScheduledTaskModule = DailyScheduledTaskModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                daily_scheduled_tasked_entity_1.DailyScheduledTaskEntity,
                task_entity_1.TaskEntity,
                project_entity_1.ProjectEntity,
                area_entity_1.AreaEntity,
                user_entity_1.UserEntity,
                task_assignment_entity_1.TaskAssignmentEntity,
                subtask_entity_1.SubtaskEntity,
                check_in_entity_1.CheckInEntity,
            ]),
            task_module_1.TaskModule,
        ],
        controllers: [daily_scheduled_task_controller_1.DailyScheduledTaskController],
        exports: [daily_scheduled_task_service_1.DailyScheduledTaskService],
        providers: [daily_scheduled_task_service_1.DailyScheduledTaskService],
    })
], DailyScheduledTaskModule);
//# sourceMappingURL=daily-scheduled-task.module.js.map