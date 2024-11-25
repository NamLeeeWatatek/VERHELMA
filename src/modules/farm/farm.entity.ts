import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { FarmDto } from './dtos/farm.dto';

@Entity('farms')
@UseDto(FarmDto)
export class FarmEntity extends AbstractEntity<FarmDto> {
  @Column({ type: 'varchar', length: 50, unique: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  farmManager?: UserEntity | null;
}
