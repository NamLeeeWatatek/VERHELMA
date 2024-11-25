"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const page_dto_1 = require("../../common/dto/page.dto");
const decorators_1 = require("../../decorators");
const user_not_found_exception_1 = require("../../exceptions/user-not-found.exception");
const auth_guard_1 = require("../../guards/auth.guard");
const language_interceptor_service_1 = require("../../interceptors/language-interceptor.service");
const location_dto_1 = require("../../shared/dtos/location.dto");
const translation_service_1 = require("../../shared/services/translation.service");
const user_register_dto_1 = require("../auth/dto/user-register.dto");
const user_dto_1 = require("./dtos/user.dto");
const user_filter_dto_1 = require("./dtos/user-filter.dto");
const user_location_tracking_dto_1 = require("./dtos/user-location-tracking.dto");
const user_update_dto_1 = require("./dtos/user-update.dto");
const users_page_options_dto_1 = require("./dtos/users-page-options.dto");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
class AssignRoleDto {
    roleId;
    constructor(roleId) {
        this.roleId = roleId;
    }
}
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], AssignRoleDto.prototype, "roleId", void 0);
let UserController = class UserController {
    userService;
    translationService;
    constructor(userService, translationService) {
        this.userService = userService;
        this.translationService = translationService;
    }
    async admin(user) {
        const translation = await this.translationService.translate('admin.keywords.admin');
        return {
            text: `${translation} ${user.firstName}`,
        };
    }
    getUsers(pageOptionsDto, userFilterDto) {
        return this.userService.getUsers(pageOptionsDto, userFilterDto);
    }
    async getUser(userId) {
        return this.userService.getUser(userId);
    }
    async updateUser(userId, userUpdateDto, file) {
        const updatedUser = await this.userService.updateUser(userId, userUpdateDto, file);
        if (!updatedUser) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return { message: 'User updated successfully', user: updatedUser.toDto() };
    }
    async deleteUser(userId) {
        await this.userService.deleteUser(userId);
        return { message: 'User deleted successfully' };
    }
    async createUser(userRegisterDto, file) {
        const newUser = await this.userService.createUser(userRegisterDto, file);
        return newUser.toDto();
    }
    async assignRoleToUser(userId, assignRoleDto) {
        await this.userService.assignRoleToUser(userId, assignRoleDto.roleId);
        return { message: 'Role assigned successfully' };
    }
    async removeRole(userId) {
        await this.userService.removeRoleFromUser(userId);
        return { message: 'Role assigned successfully' };
    }
    async getLastSeenLocation(userId) {
        return this.userService.getLastSeenLocation(userId);
    }
    async updateLocation(user, location) {
        return this.userService.updateLocation(user, location);
    }
    async setSupervisor(userId, supervisor) {
        return this.userService.setSupervisor(userId, supervisor.supervisorId);
    }
    getSubordinates(userId) {
        return this.userService.getSubordinates(userId);
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, language_interceptor_service_1.UseLanguageInterceptor)(),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "admin", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get users list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [users_page_options_dto_1.UsersPageOptionsDto,
        user_filter_dto_1.UserFilterDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get user by ID',
        type: user_dto_1.UserDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: user_dto_1.UserDto, description: 'Successfully Updated' }),
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
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, user_update_dto_1.UserUpdateDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ type: user_dto_1.UserDto, description: 'Successfully Registered' }),
    (0, decorators_1.ApiFile)({ name: 'avatar' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_register_dto_1.UserRegisterDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/assign-role'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'Role assigned successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, AssignRoleDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "assignRoleToUser", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id/remove-role'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'Role assigned successfully' }),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "removeRole", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id/last-seen'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Get user's last seen location by ID",
        type: user_location_tracking_dto_1.UserLocationTrackingDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getLastSeenLocation", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/location'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'Successfully location updated' }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        location_dto_1.LocationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateLocation", null);
tslib_1.__decorate([
    (0, common_1.Put)('/set-supervisor/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Successfully set supervisor' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                supervisorId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "setSupervisor", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('subordinates/:userId'),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getSubordinates", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('users'),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService,
        translation_service_1.TranslationService])
], UserController);
//# sourceMappingURL=user.controller.js.map