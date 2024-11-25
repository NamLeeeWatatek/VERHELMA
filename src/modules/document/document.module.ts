import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentCategoryEntity } from '../document-category/document-category.entity';
import { DocumentController } from './document.controller';
import { DocumentEntity } from './document.entity';
import { DocumentService } from './document.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentCategoryEntity])],
  controllers: [DocumentController],
  exports: [DocumentService],
  providers: [DocumentService],
})
export class DocumentModule {}
