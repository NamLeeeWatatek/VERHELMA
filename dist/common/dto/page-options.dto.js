"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageOptionsDto = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../constants");
const decorators_1 = require("../../decorators");
class PageOptionsDto {
    page = 1;
    take = 10;
    get skip() {
        return (this.page - 1) * this.take;
    }
    q;
    order = constants_1.Order.ASC;
    orderBy;
}
exports.PageOptionsDto = PageOptionsDto;
tslib_1.__decorate([
    (0, decorators_1.NumberFieldOptional)({
        minimum: 1,
        default: 1,
        int: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PageOptionsDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, decorators_1.NumberFieldOptional)({
        minimum: 1,
        maximum: 50,
        default: 10,
        int: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PageOptionsDto.prototype, "take", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)(),
    tslib_1.__metadata("design:type", String)
], PageOptionsDto.prototype, "q", void 0);
tslib_1.__decorate([
    (0, decorators_1.EnumFieldOptional)(() => constants_1.Order, {
        default: constants_1.Order.ASC,
    }),
    tslib_1.__metadata("design:type", String)
], PageOptionsDto.prototype, "order", void 0);
tslib_1.__decorate([
    (0, decorators_1.StringFieldOptional)(),
    tslib_1.__metadata("design:type", String)
], PageOptionsDto.prototype, "orderBy", void 0);
//# sourceMappingURL=page-options.dto.js.map