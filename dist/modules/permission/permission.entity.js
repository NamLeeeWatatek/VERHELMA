"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const role_permission_entity_1 = require("../role-permission/role-permission.entity");
const permission_dto_1 = require("./dtos/permission.dto");
let PermissionEntity = class PermissionEntity extends abstract_entity_1.AbstractEntity {
    permissionName;
    description;
    rolePermissions;
};
exports.PermissionEntity = PermissionEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: false }),
    tslib_1.__metadata("design:type", String)
], PermissionEntity.prototype, "permissionName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PermissionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => role_permission_entity_1.RolePermission, (rolePermission) => rolePermission.permission),
    tslib_1.__metadata("design:type", Array)
], PermissionEntity.prototype, "rolePermissions", void 0);
exports.PermissionEntity = PermissionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('permissions'),
    (0, decorators_1.UseDto)(permission_dto_1.PermissionDto)
], PermissionEntity);
//# sourceMappingURL=permission.entity.js.map