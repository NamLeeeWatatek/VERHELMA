"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
class PermissionDto extends abstract_dto_1.AbstractDto {
    permissionName;
    description;
    constructor(permissionEntity) {
        super(permissionEntity);
        this.permissionName = permissionEntity.permissionName;
        this.description = permissionEntity.description;
    }
}
exports.PermissionDto = PermissionDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], PermissionDto.prototype, "permissionName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], PermissionDto.prototype, "description", void 0);
//# sourceMappingURL=permission.dto.js.map