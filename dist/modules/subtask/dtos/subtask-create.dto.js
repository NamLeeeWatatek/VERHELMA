"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtaskCreateDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SubtaskCreateDto {
    content;
}
exports.SubtaskCreateDto = SubtaskCreateDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    tslib_1.__metadata("design:type", String)
], SubtaskCreateDto.prototype, "content", void 0);
//# sourceMappingURL=subtask-create.dto.js.map