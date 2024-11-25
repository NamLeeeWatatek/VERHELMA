"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const page_dto_1 = require("./common/dto/page.dto");
const page_meta_dto_1 = require("./common/dto/page-meta.dto");
Array.prototype.toDtos = function (options) {
    return (0, lodash_1.compact)((0, lodash_1.map)(this, (item) => item.toDto(options)));
};
Array.prototype.getByLanguage = function (languageCode) {
    return this.find((translation) => languageCode === translation.languageCode)
        .text;
};
Array.prototype.toPageDto = function (pageMetaDto, options) {
    return new page_dto_1.PageDto(this.toDtos(options), pageMetaDto);
};
typeorm_1.SelectQueryBuilder.prototype.searchByString = function (q, columnNames, options) {
    if (!q) {
        return this;
    }
    this.andWhere(new typeorm_1.Brackets((qb) => {
        for (const item of columnNames) {
            qb.orWhere(`${item} ILIKE :q`);
        }
    }));
    if (options?.formStart) {
        this.setParameter('q', `${q}%`);
    }
    else {
        this.setParameter('q', `%${q}%`);
    }
    return this;
};
typeorm_1.SelectQueryBuilder.prototype.paginate = async function (pageOptionsDto, options) {
    if (!options?.takeAll) {
        this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
    }
    const entities = await this.getMany();
    let itemCount = -1;
    if (!options?.skipCount) {
        itemCount = await this.getCount();
    }
    const pageMetaDto = new page_meta_dto_1.PageMetaDto({
        itemCount,
        pageOptionsDto,
    });
    return [entities, pageMetaDto];
};
//# sourceMappingURL=boilerplate.polyfill.js.map