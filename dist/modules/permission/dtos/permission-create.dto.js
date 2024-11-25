"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionCreateDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PermissionCreateDto {
    permissionName;
    description;
    constructor() {
        this.permissionName = '';
    }
}
exports.PermissionCreateDto = PermissionCreateDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], PermissionCreateDto.prototype, "permissionName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], PermissionCreateDto.prototype, "description", void 0);
//# sourceMappingURL=permission-create.dto.js.map