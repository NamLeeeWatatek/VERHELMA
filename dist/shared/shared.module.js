"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../modules/user/user.entity");
const api_config_service_1 = require("./services/api-config.service");
const aws_s3_service_1 = require("./services/aws-s3.service");
const firebase_cloud_messaging_service_1 = require("./services/firebase-cloud-messaging.service");
const firebase_realtime_database_service_1 = require("./services/firebase-realtime-database.service");
const firebase_storage_service_1 = require("./services/firebase-storage.service");
const generator_service_1 = require("./services/generator.service");
const translation_service_1 = require("./services/translation.service");
const validator_service_1 = require("./services/validator.service");
const providers = [
    api_config_service_1.ApiConfigService,
    validator_service_1.ValidatorService,
    aws_s3_service_1.AwsS3Service,
    generator_service_1.GeneratorService,
    translation_service_1.TranslationService,
    firebase_storage_service_1.FirebaseStorageService,
    firebase_cloud_messaging_service_1.FirebaseCloudMessagingService,
    firebase_realtime_database_service_1.FirebaseFirestoreService,
];
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers,
        imports: [cqrs_1.CqrsModule, typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity])],
        exports: [...providers, cqrs_1.CqrsModule],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map