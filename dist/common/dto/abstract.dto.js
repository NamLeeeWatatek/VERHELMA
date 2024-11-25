"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTranslationDto = exports.AbstractDto = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../decorators");
const providers_1 = require("../../providers");
class AbstractDto {
    id;
    createdAt;
    updatedAt;
    translations;
    constructor(entity, options) {
        if (!options?.excludeFields) {
            this.id = entity.id;
            this.createdAt = entity.createdAt;
            this.updatedAt = entity.updatedAt;
        }
        const languageCode = providers_1.ContextProvider.getLanguage();
        if (languageCode && entity.translations) {
            const translationEntity = entity.translations.find((titleTranslation) => titleTranslation.languageCode === languageCode);
            const fields = {};
            for (const key of Object.keys(translationEntity)) {
                const metadata = Reflect.getMetadata(decorators_1.DYNAMIC_TRANSLATION_DECORATOR_KEY, this, key);
                if (metadata) {
                    fields[key] = translationEntity[key];
                }
            }
            Object.assign(this, fields);
        }
        else {
            this.translations = entity.translations?.toDtos();
        }
    }
}
exports.AbstractDto = AbstractDto;
tslib_1.__decorate([
    (0, decorators_1.UUIDField)(),
    tslib_1.__metadata("design:type", String)
], AbstractDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, decorators_1.DateField)(),
    tslib_1.__metadata("design:type", Date)
], AbstractDto.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, decorators_1.DateField)(),
    tslib_1.__metadata("design:type", Date)
], AbstractDto.prototype, "updatedAt", void 0);
class AbstractTranslationDto extends AbstractDto {
    constructor(entity) {
        super(entity, { excludeFields: true });
    }
}
exports.AbstractTranslationDto = AbstractTranslationDto;
//# sourceMappingURL=abstract.dto.js.map