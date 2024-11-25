"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../decorators");
class UserRegisterDto {
    firstName;
    lastName;
    email;
    birthday;
    password;
    phoneNumber;
}
exports.UserRegisterDto = UserRegisterDto;
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserRegisterDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserRegisterDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, decorators_1.EmailField)(),
    tslib_1.__metadata("design:type", String)
], UserRegisterDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, decorators_1.DateFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserRegisterDto.prototype, "birthday", void 0);
tslib_1.__decorate([
    (0, decorators_1.PasswordField)({ minLength: 6 }),
    tslib_1.__metadata("design:type", String)
], UserRegisterDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserRegisterDto.prototype, "phoneNumber", void 0);
//# sourceMappingURL=user-register.dto.js.map