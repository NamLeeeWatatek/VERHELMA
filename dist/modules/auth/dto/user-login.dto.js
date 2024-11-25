"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../decorators");
class UserLoginDto {
    identifier;
    password;
    deviceToken;
}
exports.UserLoginDto = UserLoginDto;
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserLoginDto.prototype, "identifier", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserLoginDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UserLoginDto.prototype, "deviceToken", void 0);
//# sourceMappingURL=user-login.dto.js.map