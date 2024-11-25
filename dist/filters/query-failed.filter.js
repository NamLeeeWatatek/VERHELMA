"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryFailedFilter = void 0;
const tslib_1 = require("tslib");
const node_http_1 = require("node:http");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
const constraint_errors_1 = require("./constraint-errors");
let QueryFailedFilter = class QueryFailedFilter {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.constraint?.startsWith('UQ')
            ? common_1.HttpStatus.CONFLICT
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            statusCode: status,
            error: node_http_1.STATUS_CODES[status],
            message: exception.constraint
                ? constraint_errors_1.constraintErrors[exception.constraint]
                : undefined,
        });
    }
};
exports.QueryFailedFilter = QueryFailedFilter;
exports.QueryFailedFilter = QueryFailedFilter = tslib_1.__decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], QueryFailedFilter);
//# sourceMappingURL=query-failed.filter.js.map