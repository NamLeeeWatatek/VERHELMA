"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const user_entity_1 = require("../user/user.entity");
const farm_dto_1 = require("./dtos/farm.dto");
let FarmEntity = class FarmEntity extends abstract_entity_1.AbstractEntity {
    name;
    description;
    farmManager;
};
exports.FarmEntity = FarmEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: false }),
    tslib_1.__metadata("design:type", String)
], FarmEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], FarmEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { nullable: true, onDelete: 'SET NULL' }),
    tslib_1.__metadata("design:type", Object)
], FarmEntity.prototype, "farmManager", void 0);
exports.FarmEntity = FarmEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('farms'),
    (0, decorators_1.UseDto)(farm_dto_1.FarmDto)
], FarmEntity);
//# sourceMappingURL=farm.entity.js.map