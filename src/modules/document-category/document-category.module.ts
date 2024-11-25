import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentCategoryController } from './document-category.controller';
import { DocumentCategoryEntity } from './document-category.entity';
import { DocumentCategoryService } from './document-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentCategoryEntity])],
  controllers: [DocumentCategoryController],
  providers: [DocumentCategoryService],
  exports: [DocumentCategoryService], // Xuất service nếu cần sử dụng ở module khác
})
export class DocumentCategoryModule {}
