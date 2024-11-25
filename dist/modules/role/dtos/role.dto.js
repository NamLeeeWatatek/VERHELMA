"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const permission_dto_1 = require("../../permission/dtos/permission.dto");
class RoleDto extends abstract_dto_1.AbstractDto {
    name;
    description;
    permissions;
    constructor(role) {
        super(role);
        this.name = role.name.toString().toUpperCase().replaceAll('_', ' ');
        this.description = role.description;
        this.permissions = role.rolePermissions?.map((rp) => new permission_dto_1.PermissionDto(rp.permission));
    }
}
exports.RoleDto = RoleDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RoleDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RoleDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], RoleDto.prototype, "permissions", void 0);
//# sourceMappingURL=role.dto.js.map