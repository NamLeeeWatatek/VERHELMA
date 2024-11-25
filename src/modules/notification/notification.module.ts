import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationController } from './notification.controller';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  exports: [NotificationService],
  providers: [NotificationService],
})
export class NotificationModule {}
