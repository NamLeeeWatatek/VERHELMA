"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
require("./boilerplate.polyfill");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_cls_1 = require("nestjs-cls");
const nestjs_i18n_1 = require("nestjs-i18n");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const permission_guard_1 = require("./guards/permission.guard");
const area_module_1 = require("./modules/area/area.module");
const auth_module_1 = require("./modules/auth/auth.module");
const check_in_module_1 = require("./modules/check-in/check-in.module");
const clock_in_module_1 = require("./modules/clock-in/clock-in.module");
const daily_scheduled_task_module_1 = require("./modules/daily-scheduled-task/daily-scheduled-task.module");
const document_module_1 = require("./modules/document/document.module");
const document_category_module_1 = require("./modules/document-category/document-category.module");
const farm_module_1 = require("./modules/farm/farm.module");
const health_checker_module_1 = require("./modules/health-checker/health-checker.module");
const location_history_module_1 = require("./modules/location-history/location-history.module");
const permission_entity_1 = require("./modules/permission/permission.entity");
const permission_module_1 = require("./modules/permission/permission.module");
const project_entity_1 = require("./modules/project/project.entity");
const project_module_1 = require("./modules/project/project.module");
const report_module_1 = require("./modules/report/report.module");
const role_entity_1 = require("./modules/role/role.entity");
const role_module_1 = require("./modules/role/role.module");
const role_service_1 = require("./modules/role/role.service");
const role_permission_entity_1 = require("./modules/role-permission/role-permission.entity");
const task_module_1 = require("./modules/task/task.module");
const task_comment_module_1 = require("./modules/task-comment/task-comment.module");
const user_entity_1 = require("./modules/user/user.entity");
const user_module_1 = require("./modules/user/user.module");
const api_config_service_1 = require("./shared/services/api-config.service");
const firebase_realtime_database_service_1 = require("./shared/services/firebase-realtime-database.service");
const shared_module_1 = require("./shared/shared.module");
const notification_module_1 = require("./modules/notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.ProjectEntity,
                role_entity_1.RoleEntity,
                role_permission_entity_1.RolePermission,
                permission_entity_1.PermissionEntity,
                user_entity_1.UserEntity,
            ]),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            task_module_1.TaskModule,
            project_module_1.ProjectModule,
            farm_module_1.FarmModule,
            clock_in_module_1.ClockInModule,
            task_comment_module_1.TaskCommentModule,
            check_in_module_1.CheckInModule,
            daily_scheduled_task_module_1.DailyScheduledTaskModule,
            area_module_1.AreaModule,
            report_module_1.ReportModule,
            document_module_1.DocumentModule,
            document_category_module_1.DocumentCategoryModule,
            permission_module_1.PermissionModule,
            role_module_1.RoleModule,
            location_history_module_1.LocationHistoryModule,
            notification_module_1.NotificationModule,
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: {
                    mount: true,
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [shared_module_1.SharedModule],
                useFactory: (configService) => ({
                    throttlers: [configService.throttlerConfigs],
                }),
                inject: [api_config_service_1.ApiConfigService],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [shared_module_1.SharedModule],
                useFactory: (configService) => configService.postgresConfig,
                inject: [api_config_service_1.ApiConfigService],
                dataSourceFactory: (options) => {
                    if (!options) {
                        throw new Error('Invalid options passed');
                    }
                    return Promise.resolve((0, typeorm_transactional_1.addTransactionalDataSource)(new typeorm_2.DataSource(options)));
                },
            }),
            nestjs_i18n_1.I18nModule.forRootAsync({
                useFactory: (configService) => ({
                    fallbackLanguage: configService.fallbackLanguage,
                    loaderOptions: {
                        path: node_path_1.default.join(__dirname, '/i18n/'),
                        watch: configService.isDevelopment,
                    },
                }),
                resolvers: [
                    { use: nestjs_i18n_1.QueryResolver, options: ['lang'] },
                    nestjs_i18n_1.AcceptLanguageResolver,
                    new nestjs_i18n_1.HeaderResolver(['x-lang']),
                ],
                imports: [shared_module_1.SharedModule],
                inject: [api_config_service_1.ApiConfigService],
            }),
            health_checker_module_1.HealthCheckerModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: permission_guard_1.PermissionGuard,
            },
            role_service_1.RoleService,
            jwt_1.JwtService,
            firebase_realtime_database_service_1.FirebaseFirestoreService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map