"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHealthIndicator = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const terminus_1 = require("@nestjs/terminus");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ServiceHealthIndicator = class ServiceHealthIndicator extends terminus_1.HealthIndicator {
    clientProxy;
    constructor(clientProxy) {
        super();
        this.clientProxy = clientProxy;
    }
    async isHealthy(eventName) {
        try {
            if (!this.clientProxy) {
                return {
                    [eventName]: {
                        status: 'down',
                    },
                };
            }
            const result = await (0, rxjs_1.firstValueFrom)(this.clientProxy.send(eventName, { check: true }).pipe((0, operators_1.timeout)(10_000)), {
                defaultValue: undefined,
            });
            return {
                [eventName]: result,
            };
        }
        catch (error) {
            throw new terminus_1.HealthCheckError(`${eventName} failed`, {
                [eventName]: error,
            });
        }
    }
};
exports.ServiceHealthIndicator = ServiceHealthIndicator;
exports.ServiceHealthIndicator = ServiceHealthIndicator = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__param(0, (0, common_1.Inject)('NATS_SERVICE')),
    tslib_1.__metadata("design:paramtypes", [microservices_1.ClientProxy])
], ServiceHealthIndicator);
//# sourceMappingURL=service.indicator.js.map