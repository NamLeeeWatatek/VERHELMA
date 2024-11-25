import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { LocationHistoryDto } from './dtos/location-history.dto';

@Entity('location_histories')
@UseDto(LocationHistoryDto)
export class LocationHistoryEntity extends AbstractEntity<LocationHistoryDto> {
  @Column({ type: 'float' })
  latitude!: number;

  @Column({ type: 'float' })
  longitude!: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
