import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import type { UserEntity } from 'modules/user/user.entity';
// import { AreaEntity } from 'modules/area/area.entity';
// import { CheckInEntity } from 'modules/check-in/check-in.entity';
// import { DailyScheduledTaskEntity } from 'modules/daily-scheduled-task/daily-scheduled-tasked.entity';
// import { ProjectEntity } from 'modules/project/project.entity';
// import { RoleEntity } from 'modules/role/role.entity';
// import { TaskEntity } from 'modules/task/task.entity';
// import { UserEntity } from 'modules/user/user.entity';
import { Repository } from 'typeorm';

import { applySorting } from '../../common/utils';
import { FolderName } from '../../constants/folder-name';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { DocumentCategoryEntity } from '../document-category/document-category.entity';
import { DocumentEntity } from './document.entity';
import type { DocumentDto } from './dtos/document.dto';
import type { DocumentCreateDto } from './dtos/document-create.dto';
import { PermissionNotFoundException } from './exceptions/permission-not-found.exception';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentCategoryEntity)
    private documentCategoryRepository: Repository<DocumentCategoryEntity>,
    private firebaseStorageService: FirebaseStorageService,
    private validatorService: ValidatorService,
  ) {}

  async create(
    documentCreateDto: DocumentCreateDto,
    file: Express.Multer.File,
    authUser: UserEntity,
  ): Promise<DocumentEntity> {
    if (!this.validatorService.isDocument(file.mimetype)) {
      throw new BadRequestException(
        'Only files in pdf, doc or docx format are allowed to be uploaded',
      );
    }

    const { fileUrl, filePath } = await this.firebaseStorageService.uploadFile(
      file,
      FolderName.Document,
    );

    let category = null;

    if (documentCreateDto.categoryId) {
      category = await this.documentCategoryRepository.findOne({
        where: { id: documentCreateDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found!');
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

  async getList(pageOptionsDto: PageOptionsDto): Promise<PageDto<DocumentDto>> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.createdBy', 'createdBy')
      .leftJoinAndSelect('document.category', 'category');

    const allowedSortColumns = ['title', 'createdAt'];

    applySorting(queryBuilder, pageOptionsDto, 'document', allowedSortColumns);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getListByCategoryId(
    categoryId: Uuid,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentDto>> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.createdBy', 'createdBy')
      .leftJoinAndSelect('document.category', 'category')
      .where('document.category = :categoryId', { categoryId });

    const allowedSortColumns = ['title', 'createdAt'];

    applySorting(queryBuilder, pageOptionsDto, 'document', allowedSortColumns);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async get(documentId: Uuid): Promise<DocumentDto> {
    const queryBuilder = this.documentRepository.createQueryBuilder('document');

    queryBuilder
      .where('document.id = :documentId', {
        documentId,
      })
      .leftJoinAndSelect('document.createdBy', 'createdBy')
      .leftJoinAndSelect('document.category', 'category');

    const documentEntity = await queryBuilder.getOne();

    if (!documentEntity) {
      throw new PermissionNotFoundException();
    }

    return documentEntity.toDto();
  }

  async delete(id: Uuid): Promise<void> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .where('document.id = :id', { id });

    const documentEntity = await queryBuilder.getOne();

    if (!documentEntity) {
      throw new PermissionNotFoundException();
    }

    await this.firebaseStorageService.deleteFile(documentEntity.filePath);

    await this.documentRepository.remove(documentEntity);
  }

  async update(id: Uuid, updateDto: DocumentCreateDto): Promise<void> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .where('document.id = :id', { id });

    const documentEntity = await queryBuilder.getOne();

    if (!documentEntity) {
      throw new NotFoundException('Document not found!');
    }

    this.documentRepository.merge(documentEntity, updateDto);

    let category = null;

    if (updateDto.categoryId) {
      category = await this.documentCategoryRepository.findOne({
        where: { id: updateDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found!');
      }
    }

    documentEntity.category = category;

    await this.documentRepository.save(documentEntity);
  }

  //   entities: string[] = [
  //     AreaEntity.entityName,
  //     CheckInEntity.entityName,
  //     DailyScheduledTaskEntity.entityName,
  //     ProjectEntity.entityName,
  //     RoleEntity.entityName,
  //     TaskEntity.entityName,
  //     UserEntity.entityName,
  //   ];

  //   async generatePermissions(): Promise<void> {
  //     const queryBuilder = this.permissionRepository
  //       .createQueryBuilder('permission')
  //       .where('permission.id = :id', { id });
  //     const permissionEntity = await queryBuilder.getOne();

  //     if (!permissionEntity) {
  //       throw new PermissionNotFoundException();
  //     }

  //     this.permissionRepository.merge(permissionEntity, permissionDto);

  //     await this.permissionRepository.save(permissionEntity);
  //   }
}
