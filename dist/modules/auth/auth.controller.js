"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const role_dto_1 = require("../../modules/role/dtos/role.dto");
const user_dto_1 = require("../user/dtos/user.dto");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("./auth.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const login_payload_dto_1 = require("./dto/login-payload.dto");
const user_login_dto_1 = require("./dto/user-login.dto");
const user_register_dto_1 = require("./dto/user-register.dto");
let AuthController = class AuthController {
    userService;
    authService;
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async userLogin(userLoginDto) {
        const userEntity = await this.authService.validateUser(userLoginDto);
        await this.userService.updateLastLogin(userEntity.id);
        if (userLoginDto.deviceToken) {
            await this.userService.updateDeviceToken(userEntity.id, userLoginDto.deviceToken);
        }
        const token = await this.authService.createAccessToken({
            userId: userEntity.id,
            role: userEntity.role ? new role_dto_1.RoleDto(userEntity.role) : undefined,
        });
        return new login_payload_dto_1.LoginPayloadDto(userEntity.toDto(), token);
    }
    async userRegister(userRegisterDto, file) {
        const createdUser = await this.userService.createUser(userRegisterDto, file);
        return createdUser.toDto();
    }
    changeUserPassword(dto) {
        return this.userService.updatePassword(dto);
    }
    getCurrentUser(user) {
        return this.authService.getUser(user);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.SetMetadata)('skipAuth', true),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({
        type: login_payload_dto_1.LoginPayloadDto,
        description: 'User info with access token',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_login_dto_1.UserLoginDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "userLogin", null);
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOkResponse)({ type: user_dto_1.UserDto, description: 'Successfully Registered' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstName: {
                    type: 'string',
                },
                lastName: {
                    type: 'string',
                },
                email: {
                    type: 'string',
                    format: 'email',
                },
                birthday: {
                    type: 'string',
                    format: 'date',
                    nullable: true,
                },
                password: {
                    type: 'string',
                    minLength: 6,
                },
                phoneNumber: {
                    type: 'string',
                    nullable: true,
                },
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_register_dto_1.UserRegisterDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "userRegister", null);
tslib_1.__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: user_dto_1.UserDto, description: 'Change password' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "changeUserPassword", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: user_dto_1.UserDto, description: 'current user info' }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map