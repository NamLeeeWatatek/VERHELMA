"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const user_entity_1 = require("../user/user.entity");
const clock_in_service_1 = require("./clock-in.service");
const clock_in_dto_1 = require("./dtos/clock-in.dto");
const clock_in_create_dto_1 = require("./dtos/clock-in-create.dto");
class GetClockInByDateDto {
    date;
}
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format. Use ISO 8601 format.' }),
    tslib_1.__metadata("design:type", String)
], GetClockInByDateDto.prototype, "date", void 0);
let ClockInController = class ClockInController {
    clockInService;
    constructor(clockInService) {
        this.clockInService = clockInService;
    }
    async clockIn(user, clockInCreateDto, files) {
        const clockInEntity = await this.clockInService.createClockIn(user, clockInCreateDto, files);
        return new clock_in_dto_1.ClockInDto(clockInEntity);
    }
    async clockOut(user, clockOutCreateDto, files) {
        const clockInEntity = await this.clockInService.createClockOut(user, clockOutCreateDto, files);
        return new clock_in_dto_1.ClockInDto(clockInEntity);
    }
    async getMyClockIn(user, pageOptionsDto) {
        return this.clockInService.getClockInByUserId(user.id, pageOptionsDto);
    }
    async getClockInByDate(user, query) {
        const { date } = query;
        return this.clockInService.getClockInByDate(user.id, date);
    }
    async getByUserId(userId, pageOptionsDto) {
        return this.clockInService.getClockInByUserId(userId, pageOptionsDto);
    }
    async getUserClockInInfo(userId, query) {
        return this.clockInService.getClockInByDate(userId, query.date);
    }
    async addClockInImage(user, file) {
        if (!file) {
            throw new common_1.BadRequestException('File image is required');
        }
        return this.clockInService.addClockInImage(user, file);
    }
    async addClockOutImage(user, file) {
        if (!file) {
            throw new common_1.BadRequestException('File image is required');
        }
        return this.clockInService.addClockOutImage(user, file);
    }
};
exports.ClockInController = ClockInController;
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clock-in' }),
    (0, swagger_1.ApiCreatedResponse)({ type: clock_in_dto_1.ClockInDto }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
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
        clock_in_create_dto_1.ClockInCreateDto, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "clockIn", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('clock-out'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clock-out' }),
    (0, swagger_1.ApiCreatedResponse)({ type: clock_in_dto_1.ClockInDto }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
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
        clock_in_create_dto_1.ClockInCreateDto, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "clockOut", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('my-clock-in'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve the clock-in and clock-out information for the logged-in user by task ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get clock-in and clock-out for the logged-in user by task ID',
        type: clock_in_dto_1.ClockInDto,
    }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "getMyClockIn", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: true })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('by-date'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: clock_in_dto_1.ClockInDto,
    }),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        GetClockInByDateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "getClockInByDate", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all clock-in and clock-out information by user ID',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "getByUserId", null);
tslib_1.__decorate([
    (0, common_1.Get)('/user/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all clock-in and clock-out information by user ID',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, GetClockInByDateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "getUserClockInInfo", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/add-clockin-image'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: clock_in_dto_1.ClockInDto,
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
    tslib_1.__param(1, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "addClockInImage", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('/add-clockout-image'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: clock_in_dto_1.ClockInDto,
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
    tslib_1.__param(1, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClockInController.prototype, "addClockOutImage", null);
exports.ClockInController = ClockInController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('clock-ins'),
    (0, common_1.Controller)('clock-ins'),
    tslib_1.__metadata("design:paramtypes", [clock_in_service_1.ClockInService])
], ClockInController);
//# sourceMappingURL=clock-in.controller.js.map