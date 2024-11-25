"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const translation_service_1 = require("../shared/services/translation.service");
let TranslationInterceptor = class TranslationInterceptor {
    translationService;
    constructor(translationService) {
        this.translationService = translationService;
    }
    intercept(_context, next) {
        return next
            .handle()
            .pipe((0, operators_1.mergeMap)((data) => this.translationService.translateNecessaryKeys(data)));
    }
};
exports.TranslationInterceptor = TranslationInterceptor;
exports.TranslationInterceptor = TranslationInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [translation_service_1.TranslationService])
], TranslationInterceptor);
//# sourceMappingURL=translation-interceptor.service.js.map