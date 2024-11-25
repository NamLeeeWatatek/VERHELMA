"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const nestjs_i18n_1 = require("nestjs-i18n");
const abstract_dto_1 = require("../../common/dto/abstract.dto");
const decorators_1 = require("../../decorators");
const providers_1 = require("../../providers");
let TranslationService = class TranslationService {
    i18n;
    constructor(i18n) {
        this.i18n = i18n;
    }
    async translate(key, options) {
        return this.i18n.translate(key, {
            ...options,
            lang: providers_1.ContextProvider.getLanguage(),
        });
    }
    async translateNecessaryKeys(dto) {
        await Promise.all((0, lodash_1.map)(dto, async (value, key) => {
            if ((0, lodash_1.isString)(value)) {
                const translateDec = Reflect.getMetadata(decorators_1.STATIC_TRANSLATION_DECORATOR_KEY, dto, key);
                if (translateDec) {
                    return this.translate(`${translateDec.translationKey ?? key}.${value}`);
                }
                return;
            }
            if (value instanceof abstract_dto_1.AbstractDto) {
                return this.translateNecessaryKeys(value);
            }
            if ((0, lodash_1.isArray)(value)) {
                return Promise.all((0, lodash_1.map)(value, (v) => {
                    if (v instanceof abstract_dto_1.AbstractDto) {
                        return this.translateNecessaryKeys(v);
                    }
                    return null;
                }));
            }
            return null;
        }));
        return dto;
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [nestjs_i18n_1.I18nService])
], TranslationService);
//# sourceMappingURL=translation.service.js.map