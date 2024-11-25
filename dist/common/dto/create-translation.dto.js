"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTranslationDto = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../constants");
const decorators_1 = require("../../decorators");
class CreateTranslationDto {
    languageCode;
    text;
}
exports.CreateTranslationDto = CreateTranslationDto;
tslib_1.__decorate([
    (0, decorators_1.EnumField)(() => constants_1.LanguageCode),
    tslib_1.__metadata("design:type", String)
], CreateTranslationDto.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], CreateTranslationDto.prototype, "text", void 0);
//# sourceMappingURL=create-translation.dto.js.map