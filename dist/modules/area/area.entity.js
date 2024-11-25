"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const area_dto_1 = require("./dtos/area.dto");
let AreaEntity = class AreaEntity extends abstract_entity_1.AbstractEntity {
    static entityName = 'area';
    name;
    latitude;
    longitude;
    description;
};
exports.AreaEntity = AreaEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    tslib_1.__metadata("design:type", String)
], AreaEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6, nullable: false }),
    tslib_1.__metadata("design:type", Number)
], AreaEntity.prototype, "latitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], AreaEntity.prototype, "longitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], AreaEntity.prototype, "description", void 0);
exports.AreaEntity = AreaEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({ name: 'areas' }),
    (0, decorators_1.UseDto)(area_dto_1.AreaDto)
], AreaEntity);
//# sourceMappingURL=area.entity.js.map