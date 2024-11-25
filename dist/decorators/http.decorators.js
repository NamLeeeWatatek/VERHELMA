"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
exports.UUIDParam = UUIDParam;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../guards/auth.guard");
const auth_user_interceptor_service_1 = require("../interceptors/auth-user-interceptor.service");
const public_route_decorator_1 = require("./public-route.decorator");
function Auth(options) {
    const isPublicRoute = options?.public ?? false;
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: isPublicRoute })), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseInterceptors)(auth_user_interceptor_service_1.AuthUserInterceptor), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }), (0, public_route_decorator_1.PublicRoute)(isPublicRoute));
}
function UUIDParam(property, ...pipes) {
    return (0, common_1.Param)(property, new common_1.ParseUUIDPipe({ version: '4' }), ...pipes);
}
//# sourceMappingURL=http.decorators.js.map