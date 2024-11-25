"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
let HttpExceptionFilter = class HttpExceptionFilter {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.getStatus();
        const r = exception.getResponse();
        const validationErrors = r.message;
        this.validationFilter(validationErrors);
        response.status(statusCode).json(r);
    }
    validationFilter(validationErrors) {
        for (const validationError of validationErrors) {
            const children = validationError.children;
            if (children && !lodash_1.default.isEmpty(children)) {
                this.validationFilter(children);
                return;
            }
            delete validationError.children;
            const constraints = validationError.constraints;
            if (!constraints) {
                return;
            }
            for (const [constraintKey, constraint] of Object.entries(constraints)) {
                if (!constraint) {
                    constraints[constraintKey] = `error.fields.${lodash_1.default.snakeCase(constraintKey)}`;
                }
            }
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = tslib_1.__decorate([
    (0, common_1.Catch)(common_1.UnprocessableEntityException),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], HttpExceptionFilter);
//# sourceMappingURL=bad-request.filter.js.map