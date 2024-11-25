"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyScheduledTaskEntity = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const area_entity_1 = require("../area/area.entity");
const project_entity_1 = require("../project/project.entity");
const subtask_entity_1 = require("../subtask/subtask.entity");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
let DailyScheduledTaskEntity = class DailyScheduledTaskEntity extends abstract_entity_1.AbstractEntity {
    static entityName = 'daily-scheduled-checkin';
    title;
    description;
    area;
    assignedUserIds;
    project;
    priority;
    startDate;
    endDate;
    startTime;
    endTime;
    isCheckInPhotoRequired = true;
    isCheckOutPhotoRequired = true;
    createdBy;
    subtasks;
    dailyTasks;
};
exports.DailyScheduledTaskEntity = DailyScheduledTaskEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], DailyScheduledTaskEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], DailyScheduledTaskEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => area_entity_1.AreaEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'area_id' }),
    tslib_1.__metadata("design:type", area_entity_1.AreaEntity)
], DailyScheduledTaskEntity.prototype, "area", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], DailyScheduledTaskEntity.prototype, "assignedUserIds", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.ProjectEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    tslib_1.__metadata("design:type", project_entity_1.ProjectEntity)
], DailyScheduledTaskEntity.prototype, "project", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    tslib_1.__metadata("design:type", Number)
], DailyScheduledTaskEntity.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], DailyScheduledTaskEntity.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], DailyScheduledTaskEntity.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], DailyScheduledTaskEntity.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], DailyScheduledTaskEntity.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], DailyScheduledTaskEntity.prototype, "isCheckInPhotoRequired", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], DailyScheduledTaskEntity.prototype, "isCheckOutPhotoRequired", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], DailyScheduledTaskEntity.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => subtask_entity_1.SubtaskEntity, (subtask) => subtask.parentTask),
    tslib_1.__metadata("design:type", Array)
], DailyScheduledTaskEntity.prototype, "subtasks", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.TaskEntity, (task) => task.sourceTask, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], DailyScheduledTaskEntity.prototype, "dailyTasks", void 0);
exports.DailyScheduledTaskEntity = DailyScheduledTaskEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('daily_scheduled_tasks')
], DailyScheduledTaskEntity);
//# sourceMappingURL=daily-scheduled-tasked.entity.js.map