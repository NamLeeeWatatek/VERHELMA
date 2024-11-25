"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckerModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const health_checker_controller_1 = require("./health-checker.controller");
const service_indicator_1 = require("./health-indicators/service.indicator");
let HealthCheckerModule = class HealthCheckerModule {
};
exports.HealthCheckerModule = HealthCheckerModule;
exports.HealthCheckerModule = HealthCheckerModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [terminus_1.TerminusModule],
        controllers: [health_checker_controller_1.HealthCheckerController],
        providers: [service_indicator_1.ServiceHealthIndicator],
    })
], HealthCheckerModule);
//# sourceMappingURL=health-checker.module.js.map