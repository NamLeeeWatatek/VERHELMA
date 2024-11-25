"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utils_1 = require("../../common/utils");
const folder_name_1 = require("../../constants/folder-name");
const firebase_storage_service_1 = require("../../shared/services/firebase-storage.service");
const validator_service_1 = require("../../shared/services/validator.service");
const document_category_entity_1 = require("../document-category/document-category.entity");
const document_entity_1 = require("./document.entity");
const permission_not_found_exception_1 = require("./exceptions/permission-not-found.exception");
let DocumentService = class DocumentService {
    documentRepository;
    documentCategoryRepository;
    firebaseStorageService;
    validatorService;
    constructor(documentRepository, documentCategoryRepository, firebaseStorageService, validatorService) {
        this.documentRepository = documentRepository;
        this.documentCategoryRepository = documentCategoryRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.validatorService = validatorService;
    }
    async create(documentCreateDto, file, authUser) {
        if (!this.validatorService.isDocument(file.mimetype)) {
            throw new common_1.BadRequestException('Only files in pdf, doc or docx format are allowed to be uploaded');
        }
        const { fileUrl, filePath } = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.Document);
        let category = null;
        if (documentCreateDto.categoryId) {
            category = await this.documentCategoryRepository.findOne({
                where: { id: documentCreateDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found!');
            }
        }
        const document = this.documentRepository.create({
            title: documentCreateDto.title,
            description: documentCreateDto.description ?? undefined,
            documentUrl: fileUrl,
            isPublic: documentCreateDto.isPublic ?? true,
            filePath,
            createdBy: authUser,
            category,
        });
        await this.documentRepository.save(document);
        return document;
    }
    async getList(pageOptionsDto) {
        const queryBuilder = this.documentRepository
            .createQueryBuilder('document')
            .leftJoinAndSelect('document.createdBy', 'createdBy')
            .leftJoinAndSelect('document.category', 'category');
        const allowedSortColumns = ['title', 'createdAt'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'document', allowedSortColumns);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async getListByCategoryId(categoryId, pageOptionsDto) {
        const queryBuilder = this.documentRepository
            .createQueryBuilder('document')
            .leftJoinAndSelect('document.createdBy', 'createdBy')
            .leftJoinAndSelect('document.category', 'category')
            .where('document.category = :categoryId', { categoryId });
        const allowedSortColumns = ['title', 'createdAt'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'document', allowedSortColumns);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async get(documentId) {
        const queryBuilder = this.documentRepository.createQueryBuilder('document');
        queryBuilder
            .where('document.id = :documentId', {
            documentId,
        })
            .leftJoinAndSelect('document.createdBy', 'createdBy')
            .leftJoinAndSelect('document.category', 'category');
        const documentEntity = await queryBuilder.getOne();
        if (!documentEntity) {
            throw new permission_not_found_exception_1.PermissionNotFoundException();
        }
        return documentEntity.toDto();
    }
    async delete(id) {
        const queryBuilder = this.documentRepository
            .createQueryBuilder('document')
            .where('document.id = :id', { id });
        const documentEntity = await queryBuilder.getOne();
        if (!documentEntity) {
            throw new permission_not_found_exception_1.PermissionNotFoundException();
        }
        await this.firebaseStorageService.deleteFile(documentEntity.filePath);
        await this.documentRepository.remove(documentEntity);
    }
    async update(id, updateDto) {
        const queryBuilder = this.documentRepository
            .createQueryBuilder('document')
            .where('document.id = :id', { id });
        const documentEntity = await queryBuilder.getOne();
        if (!documentEntity) {
            throw new common_1.NotFoundException('Document not found!');
        }
        this.documentRepository.merge(documentEntity, updateDto);
        let category = null;
        if (updateDto.categoryId) {
            category = await this.documentCategoryRepository.findOne({
                where: { id: updateDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found!');
            }
        }
        documentEntity.category = category;
        await this.documentRepository.save(documentEntity);
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_entity_1.DocumentEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(document_category_entity_1.DocumentCategoryEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        firebase_storage_service_1.FirebaseStorageService,
        validator_service_1.ValidatorService])
], DocumentService);
//# sourceMappingURL=document.service.js.map