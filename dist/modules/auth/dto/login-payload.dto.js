"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPayloadDto = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
const user_dto_1 = require("../../user/dtos/user.dto");
const token_payload_dto_1 = require("./token-payload.dto");
class LoginPayloadDto {
    user;
    token;
    constructor(user, token) {
        this.user = user;
        this.token = token;
    }
}
exports.LoginPayloadDto = LoginPayloadDto;
tslib_1.__decorate([
    (0, decorators_1.ClassField)(() => user_dto_1.UserDto),
    tslib_1.__metadata("design:type", user_dto_1.UserDto)
], LoginPayloadDto.prototype, "user", void 0);
tslib_1.__decorate([
    (0, decorators_1.ClassField)(() => token_payload_dto_1.TokenPayloadDto),
    tslib_1.__metadata("design:type", token_payload_dto_1.TokenPayloadDto)
], LoginPayloadDto.prototype, "token", void 0);
//# sourceMappingURL=login-payload.dto.js.map