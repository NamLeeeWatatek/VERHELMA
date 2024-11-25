"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const permission_controller_1 = require("./permission.controller");
const permission_entity_1 = require("./permission.entity");
const permission_service_1 = require("./permission.service");
let PermissionModule = class PermissionModule {
};
exports.PermissionModule = PermissionModule;
exports.PermissionModule = PermissionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([permission_entity_1.PermissionEntity])],
        controllers: [permission_controller_1.PermissionController],
        exports: [permission_service_1.PermissionService],
        providers: [permission_service_1.PermissionService],
    })
], PermissionModule);
//# sourceMappingURL=permission.module.js.map