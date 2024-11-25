"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const document_category_entity_1 = require("../document-category/document-category.entity");
const document_controller_1 = require("./document.controller");
const document_entity_1 = require("./document.entity");
const document_service_1 = require("./document.service");
let DocumentModule = class DocumentModule {
};
exports.DocumentModule = DocumentModule;
exports.DocumentModule = DocumentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([document_entity_1.DocumentEntity, document_category_entity_1.DocumentCategoryEntity])],
        controllers: [document_controller_1.DocumentController],
        exports: [document_service_1.DocumentService],
        providers: [document_service_1.DocumentService],
    })
], DocumentModule);
//# sourceMappingURL=document.module.js.map