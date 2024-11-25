import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { FarmEntity } from '../farm.entity';

export class FarmDto extends AbstractDto {
  name: string;

  description?: string;

  farmManager?: UserBasicDto | null;

  constructor(farmEntity: FarmEntity) {
    super(farmEntity);

    this.name = farmEntity.name;
    this.description = farmEntity.description;
    this.farmManager = farmEntity.farmManager
      ? new UserBasicDto(farmEntity.farmManager)
      : null;
  }
}
