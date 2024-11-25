"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const user_entity_1 = require("../user/user.entity");
const check_in_service_1 = require("./check-in.service");
const check_in_dto_1 = require("./dtos/check-in.dto");
const check_in_create_dto_1 = require("./dtos/check-in-create.dto");
let CheckInController = class CheckInController {
    checkInService;
    constructor(checkInService) {
        this.checkInService = checkInService;
    }
    async checkIn(user, checkInCreateDto, files) {
        const checkInEntity = await this.checkInService.createCheckIn(checkInCreateDto, user, files);
        return new check_in_dto_1.CheckInDto(checkInEntity);
    }
    async checkOut(user, checkOutCreateDto, files) {
        const checkInEntity = await this.checkInService.createCheckOut(checkOutCreateDto, user, files);
        return new check_in_dto_1.CheckInDto(checkInEntity);
    }
    async getMyCheckInByTaskId(user, taskId) {
        const userId = user.id;
        return this.checkInService.getCheckInByUserAndTask(userId, taskId);
    }
    async getByTaskId(taskId) {
        return this.checkInService.getByTaskId(taskId);
    }
    async addCheckInImage(user, taskId, file) {
        if (!file) {
            throw new common_1.BadRequestException('File image is required');
        }
        return this.checkInService.addCheckInImage(taskId, file, user);
    }
    async addCheckOutImage(user, taskId, file) {
        if (!file) {
            throw new common_1.BadRequestException('File image is required');
        }
        return this.checkInService.addCheckOutImage(taskId, file, user);
    }
};
exports.CheckInController = CheckInController;
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new check-in' }),
    (0, swagger_1.ApiCreatedResponse)({ type: check_in_dto_1.CheckInDto }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    format: 'uuid',
                },
                latitude: {
                    type: 'number',
                    nullable: true,
                },
                longitude: {
                    type: 'number',
                    nullable: true,
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.UploadedFiles)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        check_in_create_dto_1.CheckInCreateDto, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckInController.prototype, "checkIn", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('check-out'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new check-out' }),
    (0, swagger_1.ApiCreatedResponse)({ type: check_in_dto_1.CheckInDto }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    format: 'uuid',
                },
                latitude: {
                    type: 'number',
                    nullable: true,
                },
                longitude: {
                    type: 'number',
                    nullable: true,
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.UploadedFiles)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        check_in_create_dto_1.CheckInCreateDto, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckInController.prototype, "checkOut", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('my-check-in/:taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve the check-in and check-out information for the logged-in user by task ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task to retrieve check-in information',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get check-in and check-out for the logged-in user by task ID',
        type: check_in_dto_1.CheckInDto,
    }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity, String]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckInController.prototype, "getMyCheckInByTaskId", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all check-in and check-out information by task ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task to retrieve check-in information',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get check-in and check-out by task ID',
        type: check_in_dto_1.CheckInDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckInController.prototype, "getByTaskId", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/add-checkin-image/:taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task to add check in image',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: check_in_dto_1.CheckInDto,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(2, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckInController.prototype, "addCheckInImage", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/add-checkout-image/:taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task to add check out image',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: check_in_dto_1.CheckInDto,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, decorators_1.UUIDParam)('taskId')),
    tslib_1.__param(2, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckInController.prototype, "addCheckOutImage", null);
exports.CheckInController = CheckInController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('check-ins'),
    (0, common_1.Controller)('check-ins'),
    tslib_1.__metadata("design:paramtypes", [check_in_service_1.CheckInService])
], CheckInController);
//# sourceMappingURL=check-in.controller.js.map