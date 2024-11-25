"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageInterceptor = void 0;
exports.UseLanguageInterceptor = UseLanguageInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const providers_1 = require("../providers");
let LanguageInterceptor = class LanguageInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const language = request.headers['x-language-code'];
        if (constants_1.LanguageCode[language]) {
            providers_1.ContextProvider.setLanguage(language);
        }
        return next.handle();
    }
};
exports.LanguageInterceptor = LanguageInterceptor;
exports.LanguageInterceptor = LanguageInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], LanguageInterceptor);
function UseLanguageInterceptor() {
    return (0, common_1.UseInterceptors)(LanguageInterceptor);
}
//# sourceMappingURL=language-interceptor.service.js.map