import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../modules/user/user.entity';
import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { FirebaseCloudMessagingService } from './services/firebase-cloud-messaging.service';
import { FirebaseFirestoreService } from './services/firebase-realtime-database.service';
import { FirebaseStorageService } from './services/firebase-storage.service';
import { GeneratorService } from './services/generator.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  AwsS3Service,
  GeneratorService,
  TranslationService,
  FirebaseStorageService,
  FirebaseCloudMessagingService,
  FirebaseFirestoreService,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
