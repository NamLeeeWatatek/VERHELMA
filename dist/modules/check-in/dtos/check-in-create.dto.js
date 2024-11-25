"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInCreateDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CheckInCreateDto {
    taskId;
    latitude;
    longitude;
}
exports.CheckInCreateDto = CheckInCreateDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CheckInCreateDto.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'number' }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], CheckInCreateDto.prototype, "latitude", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'number' }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], CheckInCreateDto.prototype, "longitude", void 0);
//# sourceMappingURL=check-in-create.dto.js.map