"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../../common/utils");
const constants_1 = require("../../constants");
const exceptions_1 = require("../../exceptions");
const api_config_service_1 = require("../../shared/services/api-config.service");
const user_service_1 = require("../user/user.service");
const token_payload_dto_1 = require("./dto/token-payload.dto");
let AuthService = class AuthService {
    jwtService;
    configService;
    userService;
    constructor(jwtService, configService, userService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
    }
    async createAccessToken(data) {
        return new token_payload_dto_1.TokenPayloadDto({
            expiresIn: this.configService.authConfig.jwtExpirationTime,
            accessToken: await this.jwtService.signAsync({
                userId: data.userId,
                type: constants_1.TokenType.ACCESS_TOKEN,
                role: data.role,
            }),
        });
    }
    async validateUser(userLoginDto) {
        const { identifier, password } = userLoginDto;
        const normalizedIdentifier = this.isEmail(identifier)
            ? identifier.toLowerCase()
            : identifier;
        const user = await (this.isEmail(identifier)
            ? this.userService.findOne({ email: normalizedIdentifier })
            : this.userService.findOne({ phoneNumber: normalizedIdentifier }));
        if (!user || !(await (0, utils_1.validateHash)(password, user.password))) {
            throw new exceptions_1.UserNotFoundException();
        }
        return user;
    }
    async getUser(user) {
        return this.userService.getUser(user.id);
    }
    isEmail(identifier) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(identifier);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [jwt_1.JwtService,
        api_config_service_1.ApiConfigService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map