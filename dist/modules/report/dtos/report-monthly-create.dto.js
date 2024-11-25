"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportMonthlyCreateDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ReportMonthlyCreateDto {
    monthTime;
    projectId;
    userIds;
}
exports.ReportMonthlyCreateDto = ReportMonthlyCreateDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], ReportMonthlyCreateDto.prototype, "monthTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ReportMonthlyCreateDto.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    tslib_1.__metadata("design:type", Array)
], ReportMonthlyCreateDto.prototype, "userIds", void 0);
//# sourceMappingURL=report-monthly-create.dto.js.map