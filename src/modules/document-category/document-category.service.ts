import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import { Repository } from 'typeorm';

import { DocumentCategoryEntity } from './document-category.entity';
import type { DocumentCategoryDto } from './dtos/document-category.dto';
import type { DocumentCategoryCreateDto } from './dtos/document-category-create.dto';

@Injectable()
export class DocumentCategoryService {
  constructor(
    @InjectRepository(DocumentCategoryEntity)
    private readonly documentCategoryRepository: Repository<DocumentCategoryEntity>,
  ) {}

  async create(dto: DocumentCategoryCreateDto): Promise<DocumentCategoryDto> {
    const category = this.documentCategoryRepository.create(dto);
    await this.documentCategoryRepository.save(category);

    return category.toDto();
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentCategoryDto>> {
    const queryBuilder =
      this.documentCategoryRepository.createQueryBuilder('documentCat');

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(documentCat.name) LIKE :name', {
        name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findById(id: Uuid): Promise<DocumentCategoryDto> {
    const queryBuilder =
      this.documentCategoryRepository.createQueryBuilder('category');

    queryBuilder.where('category.id = :id', {
      id,
    });

    const category = await queryBuilder.getOne();

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category.toDto();
  }

  async update(id: number, dto: DocumentCategoryCreateDto): Promise<void> {
    const queryBuilder = this.documentCategoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id });

    const category = await queryBuilder.getOne();

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    this.documentCategoryRepository.merge(category, dto);

    await this.documentCategoryRepository.save(category);
  }

  async remove(id: Uuid): Promise<void> {
    const queryBuilder = this.documentCategoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id });

    const categoryEntity = await queryBuilder.getOne();

    if (!categoryEntity) {
      throw new NotFoundException('Category not found!');
    }

    await this.documentCategoryRepository.remove(categoryEntity);
  }

  async countDocuments(id: Uuid): Promise<number> {
    const queryBuilder = this.documentCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.documents', 'documents')
      .where('category.id = :id', { id });

    const categoryEntity = await queryBuilder.getOne();

    if (!categoryEntity) {
      throw new NotFoundException('Category not found!');
    }

    return categoryEntity.documents.length;
  }
}
