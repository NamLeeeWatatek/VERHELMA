import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { LocationDto } from 'shared/dtos/location.dto';
import { Between, Repository } from 'typeorm';

import type { UserEntity } from '../user/user.entity';
import { LocationHistoryBasicDto } from './dtos/location-history-basic.dto';
import { LocationHistoryEntity } from './location-history.entity';

@Injectable()
export class LocationHistoryService {
  constructor(
    @InjectRepository(LocationHistoryEntity)
    private locationHistoryRepository: Repository<LocationHistoryEntity>,
  ) {}

  async create(user: UserEntity, location: LocationDto) {
    const record = this.locationHistoryRepository.create();

    record.latitude = location.latitude;
    record.longitude = location.longitude;
    record.user = user;

    await this.locationHistoryRepository.save(record);
  }

  async getHistory(
    userId: Uuid,
    date: Date,
  ): Promise<LocationHistoryBasicDto[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const history = await this.locationHistoryRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
        user: { id: userId },
      },
      order: { createdAt: 'ASC' },
    });

    return history.map((record) => new LocationHistoryBasicDto(record));
  }
}
