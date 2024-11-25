import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { applySorting } from '../../common/utils';
import { UserEntity } from '../user/user.entity';
import type { FarmDto } from './dtos/farm.dto';
import { FarmCreateDto } from './dtos/farm-create.dto';
import { FarmEntity } from './farm.entity';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(FarmEntity)
    private farmRepository: Repository<FarmEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Transactional()
  async createFarm(farmCreateDto: FarmCreateDto): Promise<FarmEntity> {
    const farm = this.farmRepository.create(farmCreateDto);

    if (farmCreateDto.farmManagerId) {
      const manager = await this.userRepository.findOne({
        where: { id: farmCreateDto.farmManagerId },
      });

      if (manager) {
        farm.farmManager = manager;
      } else {
        throw new Error('Manager not found');
      }
    }

    await this.farmRepository.save(farm);

    return farm;
  }

  async getFarms(pageOptionsDto: PageOptionsDto): Promise<PageDto<FarmDto>> {
    const queryBuilder = this.farmRepository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.farmManager', 'farmManager');
    const allowedSortColumns = ['farmName'];

    applySorting(queryBuilder, pageOptionsDto, 'farm', allowedSortColumns);

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(farm.name) LIKE :name', {
        name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllFarms(): Promise<FarmDto[]> {
    const queryBuilder = this.farmRepository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.farmManager', 'farmManager')
      .orderBy('farm.name', 'ASC');

    const farms = await queryBuilder.getMany();

    return farms.map((farm) => farm.toDto());
  }

  async getFarm(farmId: Uuid): Promise<FarmDto> {
    const queryBuilder = this.farmRepository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.farmManager', 'farmManager');

    queryBuilder.where('farm.id = :farmId', {
      farmId,
    });

    const farmEntity = await queryBuilder.getOne();

    if (!farmEntity) {
      throw new NotFoundException('Farm not found!');
    }

    return farmEntity.toDto();
  }

  async deleteFarm(id: Uuid): Promise<void> {
    const queryBuilder = this.farmRepository
      .createQueryBuilder('farm')
      .where('farm.id = :id', { id });

    const farmEntity = await queryBuilder.getOne();

    if (!farmEntity) {
      throw new NotFoundException('Farm not found!');
    }

    await this.farmRepository.remove(farmEntity);
  }

  async updateFarm(id: Uuid, farmDto: FarmCreateDto): Promise<void> {
    const queryBuilder = this.farmRepository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.farmManager', 'farmManager')
      .where('farm.id = :id', { id });

    const farmEntity = await queryBuilder.getOne();

    if (!farmEntity) {
      throw new NotFoundException('Farm not found!');
    }

    this.farmRepository.merge(farmEntity, farmDto);

    if (!farmDto.farmManagerId) {
      farmEntity.farmManager = null;
    }

    if (
      farmDto.farmManagerId &&
      farmDto.farmManagerId !== farmEntity.farmManager?.id
    ) {
      const manager = await this.userRepository.findOne({
        where: { id: farmDto.farmManagerId },
      });

      if (manager) {
        farmEntity.farmManager = manager;
      } else {
        throw new Error('Manager not found');
      }
    }

    await this.farmRepository.save(farmEntity);
  }
}
