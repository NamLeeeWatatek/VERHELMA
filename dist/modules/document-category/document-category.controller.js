"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const document_category_service_1 = require("./document-category.service");
const document_category_dto_1 = require("./dtos/document-category.dto");
const document_category_create_dto_1 = require("./dtos/document-category-create.dto");
let DocumentCategoryController = class DocumentCategoryController {
    documentCategoryService;
    constructor(documentCategoryService) {
        this.documentCategoryService = documentCategoryService;
    }
    async create(dto) {
        return this.documentCategoryService.create(dto);
    }
    async findAll(pageOptionsDto) {
        return this.documentCategoryService.findAll(pageOptionsDto);
    }
    async findById(id) {
        return this.documentCategoryService.findById(id);
    }
    async update(id, dto) {
        return this.documentCategoryService.update(id, dto);
    }
    async remove(id) {
        return this.documentCategoryService.remove(id);
    }
    async countDocuments(id) {
        return this.documentCategoryService.countDocuments(id);
    }
};
exports.DocumentCategoryController = DocumentCategoryController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new area' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_category_create_dto_1.DocumentCategoryCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of document categories' }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific document category by its ID' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "findById", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing document category' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, document_category_dto_1.DocumentCategoryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "remove", null);
tslib_1.__decorate([
    (0, common_1.Get)('count/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "countDocuments", null);
exports.DocumentCategoryController = DocumentCategoryController = tslib_1.__decorate([
    (0, common_1.Controller)('document-categories'),
    (0, swagger_1.ApiTags)('document-categories'),
    tslib_1.__metadata("design:paramtypes", [document_category_service_1.DocumentCategoryService])
], DocumentCategoryController);
//# sourceMappingURL=document-category.controller.js.map