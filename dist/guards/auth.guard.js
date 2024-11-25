"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = AuthGuard;
const passport_1 = require("@nestjs/passport");
function AuthGuard(options) {
    const strategies = ['jwt'];
    if (options?.public) {
        strategies.push('public');
    }
    return (0, passport_1.AuthGuard)(strategies);
}
//# sourceMappingURL=auth.guard.js.map