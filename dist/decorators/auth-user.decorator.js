"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = AuthUser;
const common_1 = require("@nestjs/common");
function AuthUser() {
    return (0, common_1.createParamDecorator)((_data, context) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user?.[Symbol.for('isPublic')]) {
            return;
        }
        return user;
    })();
}
//# sourceMappingURL=auth-user.decorator.js.map