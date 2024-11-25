"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
const parse_duration_1 = tslib_1.__importDefault(require("parse-duration"));
const user_subscriber_1 = require("../../entity-subscribers/user-subscriber");
const snake_naming_strategy_1 = require("../../snake-naming.strategy");
let ApiConfigService = class ApiConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    get isDevelopment() {
        return this.nodeEnv === 'development';
    }
    get isProduction() {
        return this.nodeEnv === 'production';
    }
    get isTest() {
        return this.nodeEnv === 'test';
    }
    getNumber(key) {
        const value = this.get(key);
        try {
            return Number(value);
        }
        catch {
            throw new Error(key + ' environment variable is not a number');
        }
    }
    getDuration(key, format) {
        const value = this.getString(key);
        const duration = (0, parse_duration_1.default)(value, format);
        if (duration === undefined) {
            throw new Error(`${key} environment variable is not a valid duration`);
        }
        return duration;
    }
    getBoolean(key) {
        const value = this.get(key);
        try {
            return Boolean(JSON.parse(value));
        }
        catch {
            throw new Error(key + ' env var is not a boolean');
        }
    }
    getString(key) {
        const value = this.get(key);
        return value.replaceAll('\\n', '\n');
    }
    get nodeEnv() {
        return this.getString('NODE_ENV');
    }
    get fallbackLanguage() {
        return this.getString('FALLBACK_LANGUAGE');
    }
    get throttlerConfigs() {
        return {
            ttl: this.getDuration('THROTTLER_TTL', 'second'),
            limit: this.getNumber('THROTTLER_LIMIT'),
        };
    }
    get postgresConfig() {
        const entities = [
            __dirname + '/../../modules/**/*.entity{.ts,.js}',
            __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
        ];
        const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
        return {
            entities,
            migrations,
            keepConnectionAlive: !this.isTest,
            dropSchema: this.isTest,
            type: 'postgres',
            name: 'default',
            host: this.getString('DB_HOST'),
            port: this.getNumber('DB_PORT'),
            username: this.getString('DB_USERNAME'),
            password: this.getString('DB_PASSWORD'),
            database: this.getString('DB_DATABASE'),
            subscribers: [user_subscriber_1.UserSubscriber],
            migrationsRun: true,
            logging: this.getBoolean('ENABLE_ORM_LOGS'),
            namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
        };
    }
    get awsS3Config() {
        return {
            bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
            bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
            bucketName: this.getString('AWS_S3_BUCKET_NAME'),
        };
    }
    get documentationEnabled() {
        return this.getBoolean('ENABLE_DOCUMENTATION');
    }
    get natsEnabled() {
        return this.getBoolean('NATS_ENABLED');
    }
    get natsConfig() {
        return {
            host: this.getString('NATS_HOST'),
            port: this.getNumber('NATS_PORT'),
        };
    }
    get authConfig() {
        return {
            privateKey: this.getString('JWT_PRIVATE_KEY'),
            publicKey: this.getString('JWT_PUBLIC_KEY'),
            jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
        };
    }
    get appConfig() {
        return {
            port: this.getString('PORT'),
        };
    }
    get(key) {
        const value = this.configService.get(key);
        if ((0, lodash_1.isNil)(value)) {
            throw new Error(key + ' environment variable does not set');
        }
        return value;
    }
};
exports.ApiConfigService = ApiConfigService;
exports.ApiConfigService = ApiConfigService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], ApiConfigService);
//# sourceMappingURL=api-config.service.js.map