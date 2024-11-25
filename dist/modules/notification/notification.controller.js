"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    getNotifications(userId, pageOptionsDto) {
        return this.notificationService.getNotificationsByUserId(userId, pageOptionsDto);
    }
};
exports.NotificationController = NotificationController;
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of notifications' }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get notifications list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
exports.NotificationController = NotificationController = tslib_1.__decorate([
    (0, common_1.Controller)('notifications'),
    (0, swagger_1.ApiTags)('notifications'),
    tslib_1.__metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map