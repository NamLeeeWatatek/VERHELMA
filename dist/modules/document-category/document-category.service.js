"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_category_entity_1 = require("./document-category.entity");
let DocumentCategoryService = class DocumentCategoryService {
    documentCategoryRepository;
    constructor(documentCategoryRepository) {
        this.documentCategoryRepository = documentCategoryRepository;
    }
    async create(dto) {
        const category = this.documentCategoryRepository.create(dto);
        await this.documentCategoryRepository.save(category);
        return category.toDto();
    }
    async findAll(pageOptionsDto) {
        const queryBuilder = this.documentCategoryRepository.createQueryBuilder('documentCat');
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(documentCat.name) LIKE :name', {
                name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async findById(id) {
        const queryBuilder = this.documentCategoryRepository.createQueryBuilder('category');
        queryBuilder.where('category.id = :id', {
            id,
        });
        const category = await queryBuilder.getOne();
        if (!category) {
            throw new common_1.NotFoundException('Category not found!');
        }
        return category.toDto();
    }
    async update(id, dto) {
        const queryBuilder = this.documentCategoryRepository
            .createQueryBuilder('category')
            .where('category.id = :id', { id });
        const category = await queryBuilder.getOne();
        if (!category) {
            throw new common_1.NotFoundException('Category not found!');
        }
        this.documentCategoryRepository.merge(category, dto);
        await this.documentCategoryRepository.save(category);
    }
    async remove(id) {
        const queryBuilder = this.documentCategoryRepository
            .createQueryBuilder('category')
            .where('category.id = :id', { id });
        const categoryEntity = await queryBuilder.getOne();
        if (!categoryEntity) {
            throw new common_1.NotFoundException('Category not found!');
        }
        await this.documentCategoryRepository.remove(categoryEntity);
    }
    async countDocuments(id) {
        const queryBuilder = this.documentCategoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.documents', 'documents')
            .where('category.id = :id', { id });
        const categoryEntity = await queryBuilder.getOne();
        if (!categoryEntity) {
            throw new common_1.NotFoundException('Category not found!');
        }
        return categoryEntity.documents.length;
    }
};
exports.DocumentCategoryService = DocumentCategoryService;
exports.DocumentCategoryService = DocumentCategoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_category_entity_1.DocumentCategoryEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentCategoryService);
//# sourceMappingURL=document-category.service.js.map