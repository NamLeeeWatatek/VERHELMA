"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_2 = require("passport");
const api_config_service_1 = require("../../shared/services/api-config.service");
let PublicStrategy = class PublicStrategy extends (0, passport_1.PassportStrategy)(passport_2.Strategy, 'public') {
    configService;
    constructor(configService) {
        super();
        this.configService = configService;
    }
    authenticate() {
        this.success({ [Symbol.for('isPublic')]: true });
    }
};
exports.PublicStrategy = PublicStrategy;
exports.PublicStrategy = PublicStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [api_config_service_1.ApiConfigService])
], PublicStrategy);
//# sourceMappingURL=public.strategy.js.map