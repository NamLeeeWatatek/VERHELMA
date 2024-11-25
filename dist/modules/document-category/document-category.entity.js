"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const document_entity_1 = require("../document/document.entity");
const document_category_dto_1 = require("./dtos/document-category.dto");
let DocumentCategoryEntity = class DocumentCategoryEntity extends abstract_entity_1.AbstractEntity {
    name;
    documents;
};
exports.DocumentCategoryEntity = DocumentCategoryEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: false }),
    tslib_1.__metadata("design:type", String)
], DocumentCategoryEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.DocumentEntity, (document) => document.category),
    tslib_1.__metadata("design:type", Array)
], DocumentCategoryEntity.prototype, "documents", void 0);
exports.DocumentCategoryEntity = DocumentCategoryEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('document-categories'),
    (0, decorators_1.UseDto)(document_category_dto_1.DocumentCategoryDto)
], DocumentCategoryEntity);
//# sourceMappingURL=document-category.entity.js.map