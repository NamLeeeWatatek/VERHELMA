"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const tslib_1 = require("tslib");
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const mime_types_1 = tslib_1.__importDefault(require("mime-types"));
const api_config_service_1 = require("./api-config.service");
const generator_service_1 = require("./generator.service");
let AwsS3Service = class AwsS3Service {
    configService;
    generatorService;
    s3;
    constructor(configService, generatorService) {
        this.configService = configService;
        this.generatorService = generatorService;
        const awsS3Config = configService.awsS3Config;
        this.s3 = new client_s3_1.S3({
            apiVersion: awsS3Config.bucketApiVersion,
            region: awsS3Config.bucketRegion,
        });
    }
    async uploadImage(file) {
        const fileName = this.generatorService.fileName(mime_types_1.default.extension(file.mimetype));
        const key = 'images/' + fileName;
        await this.s3.putObject({
            Bucket: this.configService.awsS3Config.bucketName,
            Body: file.buffer,
            ACL: 'public-read',
            Key: key,
        });
        return key;
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [api_config_service_1.ApiConfigService,
        generator_service_1.GeneratorService])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map