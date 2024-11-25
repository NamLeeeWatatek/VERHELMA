"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
let CheckInEntity = class CheckInEntity {
    static entityName = 'check-in';
    userId;
    taskId;
    user;
    task;
    checkInImageUrls;
    checkInLatitude;
    checkInLongitude;
    checkOutImageUrls;
    checkOutLatitude;
    checkOutLongitude;
    checkInTime;
    checkOutTime;
};
exports.CheckInEntity = CheckInEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], CheckInEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], CheckInEntity.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], CheckInEntity.prototype, "user", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.TaskEntity, { onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", task_entity_1.TaskEntity)
], CheckInEntity.prototype, "task", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    tslib_1.__metadata("design:type", Array)
], CheckInEntity.prototype, "checkInImageUrls", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], CheckInEntity.prototype, "checkInLatitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], CheckInEntity.prototype, "checkInLongitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    tslib_1.__metadata("design:type", Array)
], CheckInEntity.prototype, "checkOutImageUrls", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], CheckInEntity.prototype, "checkOutLatitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 9, scale: 6, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], CheckInEntity.prototype, "checkOutLongitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], CheckInEntity.prototype, "checkInTime", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    tslib_1.__metadata("design:type", Object)
], CheckInEntity.prototype, "checkOutTime", void 0);
exports.CheckInEntity = CheckInEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('check_ins')
], CheckInEntity);
//# sourceMappingURL=check-in.entity.js.map