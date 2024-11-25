"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const user_entity_1 = require("../../modules/user/user.entity");
const document_category_entity_1 = require("../document-category/document-category.entity");
const document_dto_1 = require("./dtos/document.dto");
let DocumentEntity = class DocumentEntity extends abstract_entity_1.AbstractEntity {
    title;
    description;
    documentUrl;
    filePath;
    isPublic;
    createdBy;
    category;
};
exports.DocumentEntity = DocumentEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: false }),
    tslib_1.__metadata("design:type", String)
], DocumentEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    tslib_1.__metadata("design:type", String)
], DocumentEntity.prototype, "documentUrl", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    tslib_1.__metadata("design:type", String)
], DocumentEntity.prototype, "filePath", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], DocumentEntity.prototype, "isPublic", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], DocumentEntity.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => document_category_entity_1.DocumentCategoryEntity, (category) => category.documents, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", Object)
], DocumentEntity.prototype, "category", void 0);
exports.DocumentEntity = DocumentEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('documents'),
    (0, decorators_1.UseDto)(document_dto_1.DocumentDto)
], DocumentEntity);
//# sourceMappingURL=document.entity.js.map