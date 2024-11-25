import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { DocumentCategoryEntity } from '../document-category.entity';

export class DocumentCategoryDto extends AbstractDto {
  name: string;

  constructor(documentCategoryEntity: DocumentCategoryEntity) {
    super(documentCategoryEntity);

    this.name = documentCategoryEntity.name;
  }
}
