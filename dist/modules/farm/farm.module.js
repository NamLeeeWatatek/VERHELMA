"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const farm_controller_1 = require("./farm.controller");
const farm_entity_1 = require("./farm.entity");
const farm_service_1 = require("./farm.service");
let FarmModule = class FarmModule {
};
exports.FarmModule = FarmModule;
exports.FarmModule = FarmModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([farm_entity_1.FarmEntity, user_entity_1.UserEntity])],
        controllers: [farm_controller_1.FarmController],
        exports: [farm_service_1.FarmService],
        providers: [farm_service_1.FarmService],
    })
], FarmModule);
//# sourceMappingURL=farm.module.js.map