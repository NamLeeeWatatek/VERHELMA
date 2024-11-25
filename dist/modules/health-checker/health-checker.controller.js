"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckerController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const service_indicator_1 = require("./health-indicators/service.indicator");
let HealthCheckerController = class HealthCheckerController {
    healthCheckService;
    ormIndicator;
    serviceIndicator;
    constructor(healthCheckService, ormIndicator, serviceIndicator) {
        this.healthCheckService = healthCheckService;
        this.ormIndicator = ormIndicator;
        this.serviceIndicator = serviceIndicator;
    }
    async check() {
        return this.healthCheckService.check([
            () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
            () => this.serviceIndicator.isHealthy('search-service-health'),
        ]);
    }
};
exports.HealthCheckerController = HealthCheckerController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthCheckerController.prototype, "check", null);
exports.HealthCheckerController = HealthCheckerController = tslib_1.__decorate([
    (0, common_1.Controller)('health'),
    tslib_1.__metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.TypeOrmHealthIndicator,
        service_indicator_1.ServiceHealthIndicator])
], HealthCheckerController);
//# sourceMappingURL=health-checker.controller.js.map