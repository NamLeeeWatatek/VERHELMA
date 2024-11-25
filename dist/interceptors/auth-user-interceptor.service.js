"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const providers_1 = require("../providers");
let AuthUserInterceptor = class AuthUserInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        providers_1.ContextProvider.setAuthUser(user);
        return next.handle();
    }
};
exports.AuthUserInterceptor = AuthUserInterceptor;
exports.AuthUserInterceptor = AuthUserInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AuthUserInterceptor);
//# sourceMappingURL=auth-user-interceptor.service.js.map