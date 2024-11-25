"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
class DocumentCategoryDto extends abstract_dto_1.AbstractDto {
    name;
    constructor(documentCategoryEntity) {
        super(documentCategoryEntity);
        this.name = documentCategoryEntity.name;
    }
}
exports.DocumentCategoryDto = DocumentCategoryDto;
//# sourceMappingURL=document-category.dto.js.map