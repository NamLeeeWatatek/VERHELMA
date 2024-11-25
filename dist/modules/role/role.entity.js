"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const role_permission_entity_1 = require("../role-permission/role-permission.entity");
const user_entity_1 = require("../user/user.entity");
const role_dto_1 = require("./dtos/role.dto");
let RoleEntity = class RoleEntity extends abstract_entity_1.AbstractEntity {
    static entityName = 'role';
    name;
    description;
    users;
    rolePermissions;
};
exports.RoleEntity = RoleEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    tslib_1.__metadata("design:type", String)
], RoleEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RoleEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.UserEntity, (user) => user.role),
    tslib_1.__metadata("design:type", Array)
], RoleEntity.prototype, "users", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => role_permission_entity_1.RolePermission, (rolePermission) => rolePermission.role),
    tslib_1.__metadata("design:type", Array)
], RoleEntity.prototype, "rolePermissions", void 0);
exports.RoleEntity = RoleEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('roles'),
    (0, decorators_1.UseDto)(role_dto_1.RoleDto)
], RoleEntity);
//# sourceMappingURL=role.entity.js.map