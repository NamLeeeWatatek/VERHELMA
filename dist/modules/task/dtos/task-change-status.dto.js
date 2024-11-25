"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskChangeStatusDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const task_status_1 = require("../../../constants/task-status");
class TaskChangeStatusDto {
    status;
    constructor() {
        this.status = task_status_1.TaskStatus.ToDo;
    }
}
exports.TaskChangeStatusDto = TaskChangeStatusDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], TaskChangeStatusDto.prototype, "status", void 0);
//# sourceMappingURL=task-change-status.dto.js.map