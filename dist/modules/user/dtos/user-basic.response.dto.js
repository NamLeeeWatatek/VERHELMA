"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBasicDto = void 0;
const tslib_1 = require("tslib");
const account_status_1 = require("../../../constants/account-status");
const decorators_1 = require("../../../decorators");
const role_dto_1 = require("../../role/dtos/role.dto");
class UserBasicDto {
    id;
    fullName;
    accountStatus;
    avatar;
    email;
    phoneNumber;
    isActive;
    role;
    constructor(user) {
        this.id = user.id;
        this.fullName =
            user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : null;
        this.accountStatus = user.accountStatus;
        this.avatar = user.avatar;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.role = user.role ? new role_dto_1.RoleDto(user.role) : undefined;
    }
}
exports.UserBasicDto = UserBasicDto;
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserBasicDto.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, decorators_1.EnumFieldOptional)(() => account_status_1.AccountStatus),
    tslib_1.__metadata("design:type", String)
], UserBasicDto.prototype, "accountStatus", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserBasicDto.prototype, "avatar", void 0);
tslib_1.__decorate([
    (0, decorators_1.EmailFieldOptional)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserBasicDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], UserBasicDto.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    (0, decorators_1.BooleanFieldOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], UserBasicDto.prototype, "isActive", void 0);
//# sourceMappingURL=user-basic.response.dto.js.map