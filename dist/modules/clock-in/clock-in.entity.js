"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let ClockInEntity = class ClockInEntity {
    static entityName = 'clock-in';
    id;
    user;
    clockInImageUrls;
    clockInLatitude;
    clockInLongitude;
    clockOutImageUrls;
    clockOutLatitude;
    clockOutLongitude;
    clockInTime;
    clockOutTime;
};
exports.ClockInEntity = ClockInEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], ClockInEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE', nullable: false }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], ClockInEntity.prototype, "user", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ClockInEntity.prototype, "clockInImageUrls", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ClockInEntity.prototype, "clockInLatitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ClockInEntity.prototype, "clockInLongitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ClockInEntity.prototype, "clockOutImageUrls", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ClockInEntity.prototype, "clockOutLatitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ClockInEntity.prototype, "clockOutLongitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], ClockInEntity.prototype, "clockInTime", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    tslib_1.__metadata("design:type", Object)
], ClockInEntity.prototype, "clockOutTime", void 0);
exports.ClockInEntity = ClockInEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('clock_ins')
], ClockInEntity);
//# sourceMappingURL=clock-in.entity.js.map