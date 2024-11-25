"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInCreateDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ClockInCreateDto {
    latitude;
    longitude;
}
exports.ClockInCreateDto = ClockInCreateDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'number' }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], ClockInCreateDto.prototype, "latitude", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'number' }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], ClockInCreateDto.prototype, "longitude", void 0);
//# sourceMappingURL=clock-in-create.dto.js.map