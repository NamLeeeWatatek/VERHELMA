"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryCreateDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DocumentCategoryCreateDto {
    name;
}
exports.DocumentCategoryCreateDto = DocumentCategoryCreateDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    tslib_1.__metadata("design:type", String)
], DocumentCategoryCreateDto.prototype, "name", void 0);
//# sourceMappingURL=document-category-create.dto.js.map