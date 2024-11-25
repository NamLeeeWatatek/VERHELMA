"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../decorators");
class UserUpdateDto {
    firstName;
    lastName;
    email;
    birthday;
    phoneNumber;
    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.birthday = new Date();
        this.phoneNumber = '';
    }
}
exports.UserUpdateDto = UserUpdateDto;
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserUpdateDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserUpdateDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, decorators_1.EmailField)(),
    tslib_1.__metadata("design:type", String)
], UserUpdateDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, decorators_1.DateFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserUpdateDto.prototype, "birthday", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], UserUpdateDto.prototype, "phoneNumber", void 0);
//# sourceMappingURL=user-update.dto.js.map