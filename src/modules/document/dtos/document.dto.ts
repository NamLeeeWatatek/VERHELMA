import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { DocumentEntity } from '../document.entity';

export class DocumentDto extends AbstractDto {
  title: string;

  description?: string;

  isPublic?: boolean = true;

  documentUrl: string;

  createdBy: UserBasicDto;

  category: string | null;

  constructor(document: DocumentEntity) {
    super(document);

    this.title = document.title;
    this.description = document.description;
    this.isPublic = document.isPublic;
    this.documentUrl = document.documentUrl;
    this.createdBy = new UserBasicDto(document.createdBy);
    this.category = document.category ? document.category.name : null;
  }
}
