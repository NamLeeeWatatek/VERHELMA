"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHistoryEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const user_entity_1 = require("../user/user.entity");
const location_history_dto_1 = require("./dtos/location-history.dto");
let LocationHistoryEntity = class LocationHistoryEntity extends abstract_entity_1.AbstractEntity {
    latitude;
    longitude;
    user;
};
exports.LocationHistoryEntity = LocationHistoryEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    tslib_1.__metadata("design:type", Number)
], LocationHistoryEntity.prototype, "latitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    tslib_1.__metadata("design:type", Number)
], LocationHistoryEntity.prototype, "longitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], LocationHistoryEntity.prototype, "user", void 0);
exports.LocationHistoryEntity = LocationHistoryEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('location_histories'),
    (0, decorators_1.UseDto)(location_history_dto_1.LocationHistoryDto)
], LocationHistoryEntity);
//# sourceMappingURL=location-history.entity.js.map