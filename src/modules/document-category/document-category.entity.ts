import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { DocumentEntity } from '../document/document.entity';
import { DocumentCategoryDto } from './dtos/document-category.dto';

@Entity('document-categories')
@UseDto(DocumentCategoryDto)
export class DocumentCategoryEntity extends AbstractEntity<DocumentCategoryDto> {
  @Column({ type: 'varchar', length: 50, unique: false })
  name!: string;

  @OneToMany(() => DocumentEntity, (document) => document.category)
  documents!: DocumentEntity[];
}
