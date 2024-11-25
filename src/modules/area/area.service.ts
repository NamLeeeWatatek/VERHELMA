import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { applySorting } from '../../common/utils';
import { AreaEntity } from './area.entity';
import type { AreaDto } from './dtos/area.dto';
import { AreaCreateDto } from './dtos/area-create.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaEntity)
    private areaRepository: Repository<AreaEntity>,
  ) {}

  @Transactional()
  async createArea(areaCreateDto: AreaCreateDto): Promise<AreaEntity> {
    const area = this.areaRepository.create(areaCreateDto);
    await this.areaRepository.save(area);

    return area;
  }

  async getAreas(pageOptionsDto: PageOptionsDto): Promise<PageDto<AreaDto>> {
    const queryBuilder = this.areaRepository.createQueryBuilder('area');

    const allowedSortColumns = ['name', 'createdAt'];

    applySorting(queryBuilder, pageOptionsDto, 'area', allowedSortColumns);

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(area.name) LIKE :name', {
        name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getArea(areaId: Uuid): Promise<AreaDto> {
    const queryBuilder = this.areaRepository.createQueryBuilder('area');

    queryBuilder.where('area.id = :areaId', {
      areaId,
    });

    const areaEntity = await queryBuilder.getOne();

    if (!areaEntity) {
      throw new NotFoundException('Area not found!');
    }

    return areaEntity.toDto();
  }

  async deleteArea(id: Uuid): Promise<void> {
    const queryBuilder = this.areaRepository
      .createQueryBuilder('area')
      .where('area.id = :id', { id });

    const areaEntity = await queryBuilder.getOne();

    if (!areaEntity) {
      throw new NotFoundException('Area not found!');
    }

    await this.areaRepository.remove(areaEntity);
  }

  async updateArea(id: Uuid, areaDto: AreaCreateDto): Promise<void> {
    const queryBuilder = this.areaRepository
      .createQueryBuilder('area')
      .where('area.id = :id', { id });

    const areaEntity = await queryBuilder.getOne();

    if (!areaEntity) {
      throw new NotFoundException('Area not found!');
    }

    this.areaRepository.merge(areaEntity, areaDto);

    await this.areaRepository.save(areaEntity);
  }
}
