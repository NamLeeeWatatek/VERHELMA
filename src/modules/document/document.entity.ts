import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../../modules/user/user.entity';
import { DocumentCategoryEntity } from '../document-category/document-category.entity';
import { DocumentDto as DocumentDto } from './dtos/document.dto';

@Entity('documents')
@UseDto(DocumentDto)
export class DocumentEntity extends AbstractEntity<DocumentDto> {
  @Column({ type: 'varchar', length: 50, unique: false })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: false })
  documentUrl!: string;

  @Column({ type: 'text', nullable: false })
  filePath!: string;

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy!: UserEntity;

  @ManyToOne(() => DocumentCategoryEntity, (category) => category.documents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category!: DocumentCategoryEntity | null;
}
