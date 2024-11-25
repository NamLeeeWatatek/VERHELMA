"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const constants_1 = require("../../constants");
const api_config_service_1 = require("../../shared/services/api-config.service");
const user_service_1 = require("../user/user.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    userService;
    constructor(configService, userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.authConfig.publicKey,
        });
        this.userService = userService;
    }
    async validate(args) {
        if (args.type !== constants_1.TokenType.ACCESS_TOKEN) {
            throw new common_1.UnauthorizedException();
        }
        const user = await this.userService.findOne({
            id: args.userId,
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [api_config_service_1.ApiConfigService,
        user_service_1.UserService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map