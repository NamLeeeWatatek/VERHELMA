import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmEntity } from '../farm/farm.entity';
import { UserEntity } from '../user/user.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import { ProjectController } from './project.controller';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      UserEntity,
      UserProjectEntity,
      FarmEntity,
    ]),
  ],
  controllers: [ProjectController],
  exports: [ProjectService],
  providers: [ProjectService],
})
export class ProjectModule {}
