"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const check_in_entity_1 = require("../check-in/check-in.entity");
const farm_entity_1 = require("../farm/farm.entity");
const project_entity_1 = require("../project/project.entity");
const task_entity_1 = require("../task/task.entity");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const user_entity_1 = require("../user/user.entity");
const report_controller_1 = require("./report.controller");
const report_service_1 = require("./report.service");
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                task_entity_1.TaskEntity,
                check_in_entity_1.CheckInEntity,
                project_entity_1.ProjectEntity,
                task_assignment_entity_1.TaskAssignmentEntity,
                farm_entity_1.FarmEntity,
            ]),
        ],
        controllers: [report_controller_1.ReportController],
        exports: [report_service_1.ReportService],
        providers: [report_service_1.ReportService],
    })
], ReportModule);
//# sourceMappingURL=report.module.js.map