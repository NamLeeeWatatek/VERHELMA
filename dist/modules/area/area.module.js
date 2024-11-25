"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const area_controller_1 = require("./area.controller");
const area_entity_1 = require("./area.entity");
const area_service_1 = require("./area.service");
let AreaModule = class AreaModule {
};
exports.AreaModule = AreaModule;
exports.AreaModule = AreaModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([area_entity_1.AreaEntity])],
        controllers: [area_controller_1.AreaController],
        exports: [area_service_1.AreaService],
        providers: [area_service_1.AreaService],
    })
], AreaModule);
//# sourceMappingURL=area.module.js.map