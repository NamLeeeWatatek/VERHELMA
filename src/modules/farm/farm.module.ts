import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { FarmController } from './farm.controller';
import { FarmEntity } from './farm.entity';
import { FarmService } from './farm.service';

@Module({
  imports: [TypeOrmModule.forFeature([FarmEntity, UserEntity])],
  controllers: [FarmController],
  exports: [FarmService],
  providers: [FarmService],
})
export class FarmModule {}
