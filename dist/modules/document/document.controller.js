"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const user_entity_1 = require("../../modules/user/user.entity");
const document_service_1 = require("./document.service");
const document_dto_1 = require("./dtos/document.dto");
const document_create_dto_1 = require("./dtos/document-create.dto");
let DocumentController = class DocumentController {
    documentService;
    constructor(documentService) {
        this.documentService = documentService;
    }
    async createDocument(user, documentCreateDto, document) {
        const createdDocument = await this.documentService.create(documentCreateDto, document, user);
        return createdDocument.toDto();
    }
    getDocuments(pageOptionsDto) {
        return this.documentService.getList(pageOptionsDto);
    }
    getDocumentsByCategoryId(categoryId, pageOptionsDto) {
        return this.documentService.getListByCategoryId(categoryId, pageOptionsDto);
    }
    getDocument(documentId) {
        return this.documentService.get(documentId);
    }
    updateDocument(id, documentUpdateDto) {
        return this.documentService.update(id, documentUpdateDto);
    }
    async delete(id) {
        await this.documentService.delete(id);
    }
};
exports.DocumentController = DocumentController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new document' }),
    (0, swagger_1.ApiCreatedResponse)({ type: document_dto_1.DocumentDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('document')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                    nullable: true,
                },
                isPublic: {
                    type: 'boolean',
                    nullable: true,
                },
                categoryId: {
                    type: 'Uuid',
                    nullable: true,
                },
                document: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        document_create_dto_1.DocumentCreateDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "createDocument", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of documents' }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get documents list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocuments", null);
tslib_1.__decorate([
    (0, common_1.Get)(':categoryId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve a paginated list of documents according to the category.',
    }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get documents list by categoryId',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('categoryId')),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentsByCategoryId", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific document by its ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the document to retrieve' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get document',
        type: document_dto_1.DocumentDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocument", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing document' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the document to update' }),
    (0, swagger_1.ApiBody)({
        type: document_create_dto_1.DocumentCreateDto,
        description: 'Updated document data',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Document updated successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_create_dto_1.DocumentCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "updateDocument", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific document' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the document to delete' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Document deleted successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "delete", null);
exports.DocumentController = DocumentController = tslib_1.__decorate([
    (0, common_1.Controller)('documents'),
    (0, swagger_1.ApiTags)('documents'),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentController);
//# sourceMappingURL=document.controller.js.map