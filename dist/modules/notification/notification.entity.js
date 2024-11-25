"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const notification_type_enum_1 = require("../../constants/notification-type.enum");
const notification_dto_1 = require("./dtos/notification.dto");
const decorators_1 = require("../../decorators");
let NotificationEntity = class NotificationEntity extends abstract_entity_1.AbstractEntity {
    userId;
    title;
    body;
    data = null;
    type;
    isRead;
};
exports.NotificationEntity = NotificationEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], NotificationEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], NotificationEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text'),
    tslib_1.__metadata("design:type", String)
], NotificationEntity.prototype, "body", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('json', { nullable: true, default: null }),
    tslib_1.__metadata("design:type", Object)
], NotificationEntity.prototype, "data", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], NotificationEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], NotificationEntity.prototype, "isRead", void 0);
exports.NotificationEntity = NotificationEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, decorators_1.UseDto)(notification_dto_1.NotificationDto)
], NotificationEntity);
//# sourceMappingURL=notification.entity.js.map