"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../decorators");
const page_meta_dto_1 = require("./page-meta.dto");
class PageDto {
    data;
    meta;
    constructor(data, meta) {
        this.data = data;
        this.meta = meta;
    }
}
exports.PageDto = PageDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    tslib_1.__metadata("design:type", Array)
], PageDto.prototype, "data", void 0);
tslib_1.__decorate([
    (0, decorators_1.ClassField)(() => page_meta_dto_1.PageMetaDto),
    tslib_1.__metadata("design:type", page_meta_dto_1.PageMetaDto)
], PageDto.prototype, "meta", void 0);
//# sourceMappingURL=page.dto.js.map