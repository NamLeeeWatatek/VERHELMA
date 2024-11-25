import { UserBasicDto } from '../../user/dtos/user-basic.response.dto';
import type { FarmEntity } from '../farm.entity';

export class FarmInfoDto {
    id:string;
  name: string;

  description?: string;

  farmManager?: UserBasicDto | null;

  constructor(farmEntity: FarmEntity) {
    this.id=farmEntity.id;
    this.name = farmEntity.name;
    this.description = farmEntity.description;
    this.farmManager = farmEntity.farmManager
      ? new UserBasicDto(farmEntity.farmManager)
      : null;
  }
}
