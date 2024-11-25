"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const tslib_1 = require("tslib");
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const account_status_1 = require("../../../constants/account-status");
const decorators_1 = require("../../../decorators");
const role_dto_1 = require("../../role/dtos/role.dto");
const user_basic_response_dto_1 = require("./user-basic.response.dto");
class UserDto extends abstract_dto_1.AbstractDto {
    firstName;
    lastName;
    username;
    fullName;
    accountStatus;
    avatar;
    email;
    phoneNumber;
    isActive;
    birthday;
    supervisor;
    role;
    latitude = 0;
    longitude = 0;
    constructor(user) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.userName;
        this.fullName =
            user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : null;
        this.supervisor = user.supervisor
            ? new user_basic_response_dto_1.UserBasicDto(user.supervisor)
            : null;
        this.accountStatus = user.accountStatus;
        this.avatar = user.avatar;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.birthday = user.birthday;
        this.role = user.role ? new role_dto_1.RoleDto(user.role) : undefined;
        this.longitude = user.longitude ?? 0;
        this.latitude = user.latitude ?? 0;
    }
}
exports.UserDto = UserDto;
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, decorators_1.EnumFieldOptional)(() => account_status_1.AccountStatus),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "accountStatus", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "avatar", void 0);
tslib_1.__decorate([
    (0, decorators_1.EmailFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    (0, decorators_1.BooleanFieldOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], UserDto.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, decorators_1.DateFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserDto.prototype, "birthday", void 0);
//# sourceMappingURL=user.dto.js.map