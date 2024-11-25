import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AreaEntity } from '../area.entity';

export class AreaDto extends AbstractDto {
  name: string;

  latitude: number;

  longitude: number;

  description?: string;

  constructor(area: AreaEntity) {
    super(area);
    this.name = area.name;
    this.latitude = area.latitude;
    this.longitude = area.longitude;
    this.description = area.description;
  }
}
