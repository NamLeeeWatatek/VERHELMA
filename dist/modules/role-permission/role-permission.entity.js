"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("../permission/permission.entity");
const role_entity_1 = require("../role/role.entity");
let RolePermission = class RolePermission {
    roleId;
    permissionId;
    role;
    permission;
};
exports.RolePermission = RolePermission;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'role_id' }),
    tslib_1.__metadata("design:type", String)
], RolePermission.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'permission_id' }),
    tslib_1.__metadata("design:type", String)
], RolePermission.prototype, "permissionId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.RoleEntity, (role) => role.rolePermissions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id', referencedColumnName: 'id' }),
    tslib_1.__metadata("design:type", role_entity_1.RoleEntity)
], RolePermission.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_entity_1.PermissionEntity, (permission) => permission.rolePermissions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'permission_id', referencedColumnName: 'id' }),
    tslib_1.__metadata("design:type", permission_entity_1.PermissionEntity)
], RolePermission.prototype, "permission", void 0);
exports.RolePermission = RolePermission = tslib_1.__decorate([
    (0, typeorm_1.Entity)('role_permissions')
], RolePermission);
//# sourceMappingURL=role-permission.entity.js.map