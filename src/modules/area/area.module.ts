import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AreaController } from './area.controller';
import { AreaEntity } from './area.entity';
import { AreaService } from './area.service';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  controllers: [AreaController],
  exports: [AreaService],
  providers: [AreaService],
})
export class AreaModule {}
