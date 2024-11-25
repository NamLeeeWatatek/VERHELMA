"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHistoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const decorators_1 = require("../../decorators");
const location_history_service_1 = require("./location-history.service");
let LocationHistoryController = class LocationHistoryController {
    locationHistoryService;
    constructor(locationHistoryService) {
        this.locationHistoryService = locationHistoryService;
    }
    async getHistory(userId, dateString) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        return this.locationHistoryService.getHistory(userId, date);
    }
};
exports.LocationHistoryController = LocationHistoryController;
tslib_1.__decorate([
    (0, common_1.Get)(':userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.ApiPageResponse)({
        description: 'Tracking location history',
        type: page_dto_1.PageDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateString',
        required: true,
        description: 'Date string for filtering location history',
        type: String,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__param(1, (0, common_1.Query)('dateString')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], LocationHistoryController.prototype, "getHistory", null);
exports.LocationHistoryController = LocationHistoryController = tslib_1.__decorate([
    (0, common_1.Controller)('location-histories'),
    (0, swagger_1.ApiTags)('location-history'),
    tslib_1.__metadata("design:paramtypes", [location_history_service_1.LocationHistoryService])
], LocationHistoryController);
//# sourceMappingURL=location-history.controller.js.map