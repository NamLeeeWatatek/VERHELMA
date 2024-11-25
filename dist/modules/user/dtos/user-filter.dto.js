"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilterDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const account_status_1 = require("../../../constants/account-status");
const field_decorators_1 = require("../../../decorators/field.decorators");
class UserFilterDto {
    accountStatus;
    role;
}
exports.UserFilterDto = UserFilterDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(account_status_1.AccountStatus),
    tslib_1.__metadata("design:type", String)
], UserFilterDto.prototype, "accountStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, field_decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserFilterDto.prototype, "role", void 0);
//# sourceMappingURL=user-filter.dto.js.map