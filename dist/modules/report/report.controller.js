"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const user_entity_1 = require("../user/user.entity");
const report_filter_dto_1 = require("./dtos/report-filter.dto");
const report_monthly_create_dto_1 = require("./dtos/report-monthly-create.dto");
const report_range_create_dto_1 = require("./dtos/report-range-create.dto");
const report_service_1 = require("./report.service");
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async createRangeReport(dto) {
        return this.reportService.createRangeReport(dto);
    }
    async createMonthlyReport(dto) {
        return this.reportService.createMonthlyReport(dto);
    }
    async getTaskReport(userId, startDateString, endDateString) {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        return this.reportService.generateUserReport(userId, startDate, endDate);
    }
    async getProjectReport(id) {
        return this.reportService.generateProjectReport(id);
    }
    async getReport(requester, filterDto) {
        return this.reportService.generateReport(requester, filterDto);
    }
};
exports.ReportController = ReportController;
tslib_1.__decorate([
    (0, common_1.Post)('/range'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a range report' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Created range report successfully!',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [report_range_create_dto_1.ReportRangeCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "createRangeReport", null);
tslib_1.__decorate([
    (0, common_1.Post)('/monthly'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a monthly report' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Created monthly report successfully!',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [report_monthly_create_dto_1.ReportMonthlyCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "createMonthlyReport", null);
tslib_1.__decorate([
    (0, common_1.Get)(':userId'),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('userId')),
    tslib_1.__param(1, (0, common_1.Query)('startDate')),
    tslib_1.__param(2, (0, common_1.Query)('endDate')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "getTaskReport", null);
tslib_1.__decorate([
    (0, common_1.Get)('project/:projectId'),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('projectId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "getProjectReport", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    tslib_1.__param(0, (0, decorators_1.AuthUser)()),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.UserEntity,
        report_filter_dto_1.ReportFilterDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "getReport", null);
exports.ReportController = ReportController = tslib_1.__decorate([
    (0, common_1.Controller)('reports'),
    (0, swagger_1.ApiTags)('reports'),
    tslib_1.__metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map