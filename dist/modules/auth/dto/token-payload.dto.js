"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPayloadDto = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
class TokenPayloadDto {
    expiresIn;
    accessToken;
    constructor(data) {
        this.expiresIn = data.expiresIn;
        this.accessToken = data.accessToken;
    }
}
exports.TokenPayloadDto = TokenPayloadDto;
tslib_1.__decorate([
    (0, decorators_1.NumberField)(),
    tslib_1.__metadata("design:type", Number)
], TokenPayloadDto.prototype, "expiresIn", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringField)(),
    tslib_1.__metadata("design:type", String)
], TokenPayloadDto.prototype, "accessToken", void 0);
//# sourceMappingURL=token-payload.dto.js.map