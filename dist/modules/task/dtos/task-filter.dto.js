"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFilterDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const task_status_1 = require("../../../constants/task-status");
const decorators_1 = require("../../../decorators");
class TaskFilterDto {
    status;
    priority;
    startDateRange;
    dueDateRange;
    isCheckInPhotoRequired;
    isCheckOutPhotoRequired;
    projectId;
    areaId;
}
exports.TaskFilterDto = TaskFilterDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_status_1.TaskStatus),
    tslib_1.__metadata("design:type", String)
], TaskFilterDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    tslib_1.__metadata("design:type", Number)
], TaskFilterDto.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Range time for startDate',
        example: ['2024-11-01T00:00:00.000Z', '2024-11-02T00:00:00.000Z'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsDateString)({}, { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskFilterDto.prototype, "startDateRange", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Range time for dueDate',
        example: ['2024-11-01T00:00:00.000Z', '2024-11-02T00:00:00.000Z'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskFilterDto.prototype, "dueDateRange", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, decorators_1.ToBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], TaskFilterDto.prototype, "isCheckInPhotoRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, decorators_1.ToBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], TaskFilterDto.prototype, "isCheckOutPhotoRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TaskFilterDto.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TaskFilterDto.prototype, "areaId", void 0);
//# sourceMappingURL=task-filter.dto.js.map