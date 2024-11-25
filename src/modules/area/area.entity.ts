import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { AreaDto } from './dtos/area.dto';

@Entity({ name: 'areas' })
@UseDto(AreaDto)
export class AreaEntity extends AbstractEntity<AreaDto> {
  static entityName = 'area';

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: false })
  latitude!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
