"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSettingsDto = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
class CreateSettingsDto {
    isEmailVerified;
    isPhoneVerified;
}
exports.CreateSettingsDto = CreateSettingsDto;
tslib_1.__decorate([
    (0, decorators_1.BooleanFieldOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateSettingsDto.prototype, "isEmailVerified", void 0);
tslib_1.__decorate([
    (0, decorators_1.BooleanFieldOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateSettingsDto.prototype, "isPhoneVerified", void 0);
//# sourceMappingURL=create-settings.dto.js.map