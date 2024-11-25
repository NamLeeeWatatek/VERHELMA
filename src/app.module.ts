import './boilerplate.polyfill';

import path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { PermissionGuard } from './guards/permission.guard';
import { AreaModule } from './modules/area/area.module';
import { AuthModule } from './modules/auth/auth.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { ClockInModule } from './modules/clock-in/clock-in.module';
import { DailyScheduledTaskModule } from './modules/daily-scheduled-task/daily-scheduled-task.module';
import { DocumentModule } from './modules/document/document.module';
import { DocumentCategoryModule } from './modules/document-category/document-category.module';
import { FarmModule } from './modules/farm/farm.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { LocationHistoryModule } from './modules/location-history/location-history.module';
import { PermissionEntity } from './modules/permission/permission.entity';
import { PermissionModule } from './modules/permission/permission.module';
import { ProjectEntity } from './modules/project/project.entity';
import { ProjectModule } from './modules/project/project.module';
import { ReportModule } from './modules/report/report.module';
import { RoleEntity } from './modules/role/role.entity';
import { RoleModule } from './modules/role/role.module';
import { RoleService } from './modules/role/role.service';
import { RolePermission } from './modules/role-permission/role-permission.entity';
import { TaskModule } from './modules/task/task.module';
import { TaskCommentModule } from './modules/task-comment/task-comment.module';
import { UserEntity } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { FirebaseFirestoreService } from './shared/services/firebase-realtime-database.service';
import { SharedModule } from './shared/shared.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      RoleEntity,
      RolePermission,
      PermissionEntity,
      UserEntity,
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    TaskModule,
    ProjectModule,
    FarmModule,
    ClockInModule,
    TaskCommentModule,
    CheckInModule,
    DailyScheduledTaskModule,
    AreaModule,
    ReportModule,
    DocumentModule,
    DocumentCategoryModule,
    PermissionModule,
    RoleModule,
    LocationHistoryModule,
    NotificationModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    RoleService,
    JwtService,
    FirebaseFirestoreService,
  ],
})
export class AppModule {}
