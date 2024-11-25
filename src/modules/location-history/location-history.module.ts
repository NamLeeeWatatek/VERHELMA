import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationHistoryController } from './location-history.controller';
import { LocationHistoryEntity } from './location-history.entity';
import { LocationHistoryService } from './location-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationHistoryEntity])],
  controllers: [LocationHistoryController],
  exports: [LocationHistoryService],
  providers: [LocationHistoryService],
})
export class LocationHistoryModule {}
