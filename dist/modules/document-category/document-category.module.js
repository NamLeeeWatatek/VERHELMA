"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const document_category_controller_1 = require("./document-category.controller");
const document_category_entity_1 = require("./document-category.entity");
const document_category_service_1 = require("./document-category.service");
let DocumentCategoryModule = class DocumentCategoryModule {
};
exports.DocumentCategoryModule = DocumentCategoryModule;
exports.DocumentCategoryModule = DocumentCategoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([document_category_entity_1.DocumentCategoryEntity])],
        controllers: [document_category_controller_1.DocumentCategoryController],
        providers: [document_category_service_1.DocumentCategoryService],
        exports: [document_category_service_1.DocumentCategoryService],
    })
], DocumentCategoryModule);
//# sourceMappingURL=document-category.module.js.map