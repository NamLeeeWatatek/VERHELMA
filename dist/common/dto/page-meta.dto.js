"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageMetaDto = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../decorators");
class PageMetaDto {
    page;
    take;
    itemCount;
    pageCount;
    hasPreviousPage;
    hasNextPage;
    constructor({ pageOptionsDto, itemCount }) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
exports.PageMetaDto = PageMetaDto;
tslib_1.__decorate([
    (0, decorators_1.NumberField)(),
    tslib_1.__metadata("design:type", Number)
], PageMetaDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, decorators_1.NumberField)(),
    tslib_1.__metadata("design:type", Number)
], PageMetaDto.prototype, "take", void 0);
tslib_1.__decorate([
    (0, decorators_1.NumberField)(),
    tslib_1.__metadata("design:type", Number)
], PageMetaDto.prototype, "itemCount", void 0);
tslib_1.__decorate([
    (0, decorators_1.NumberField)(),
    tslib_1.__metadata("design:type", Number)
], PageMetaDto.prototype, "pageCount", void 0);
tslib_1.__decorate([
    (0, decorators_1.BooleanField)(),
    tslib_1.__metadata("design:type", Boolean)
], PageMetaDto.prototype, "hasPreviousPage", void 0);
tslib_1.__decorate([
    (0, decorators_1.BooleanField)(),
    tslib_1.__metadata("design:type", Boolean)
], PageMetaDto.prototype, "hasNextPage", void 0);
//# sourceMappingURL=page-meta.dto.js.map