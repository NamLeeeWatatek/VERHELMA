"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
const clock_in_controller_1 = require("./clock-in.controller");
const clock_in_entity_1 = require("./clock-in.entity");
const clock_in_service_1 = require("./clock-in.service");
let ClockInModule = class ClockInModule {
};
exports.ClockInModule = ClockInModule;
exports.ClockInModule = ClockInModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([clock_in_entity_1.ClockInEntity, user_entity_1.UserEntity, task_entity_1.TaskEntity])],
        controllers: [clock_in_controller_1.ClockInController],
        providers: [clock_in_service_1.ClockInService],
    })
], ClockInModule);
//# sourceMappingURL=clock-in.module.js.map