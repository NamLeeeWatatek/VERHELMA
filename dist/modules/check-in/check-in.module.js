"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
const check_in_controller_1 = require("./check-in.controller");
const check_in_entity_1 = require("./check-in.entity");
const check_in_service_1 = require("./check-in.service");
let CheckInModule = class CheckInModule {
};
exports.CheckInModule = CheckInModule;
exports.CheckInModule = CheckInModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([check_in_entity_1.CheckInEntity, user_entity_1.UserEntity, task_entity_1.TaskEntity])],
        controllers: [check_in_controller_1.CheckInController],
        providers: [check_in_service_1.CheckInService],
    })
], CheckInModule);
//# sourceMappingURL=check-in.module.js.map