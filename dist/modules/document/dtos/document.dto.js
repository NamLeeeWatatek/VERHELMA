"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class DocumentDto extends abstract_dto_1.AbstractDto {
    title;
    description;
    isPublic = true;
    documentUrl;
    createdBy;
    category;
    constructor(document) {
        super(document);
        this.title = document.title;
        this.description = document.description;
        this.isPublic = document.isPublic;
        this.documentUrl = document.documentUrl;
        this.createdBy = new user_basic_response_dto_1.UserBasicDto(document.createdBy);
        this.category = document.category ? document.category.name : null;
    }
}
exports.DocumentDto = DocumentDto;
//# sourceMappingURL=document.dto.js.map