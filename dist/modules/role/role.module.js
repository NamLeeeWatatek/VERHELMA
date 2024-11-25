"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_entity_1 = require("../../modules/role-permission/role-permission.entity");
const permission_entity_1 = require("../permission/permission.entity");
const role_controller_1 = require("./role.controller");
const role_entity_1 = require("./role.entity");
const role_service_1 = require("./role.service");
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.RoleEntity, role_permission_entity_1.RolePermission, permission_entity_1.PermissionEntity]),
        ],
        controllers: [role_controller_1.RoleController],
        exports: [role_service_1.RoleService],
        providers: [role_service_1.RoleService],
    })
], RoleModule);
//# sourceMappingURL=role.module.js.map