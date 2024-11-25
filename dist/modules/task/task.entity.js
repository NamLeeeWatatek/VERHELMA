"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const task_status_1 = require("../../constants/task-status");
const decorators_1 = require("../../decorators");
const area_entity_1 = require("../area/area.entity");
const daily_scheduled_tasked_entity_1 = require("../daily-scheduled-task/daily-scheduled-tasked.entity");
const project_entity_1 = require("../project/project.entity");
const subtask_entity_1 = require("../subtask/subtask.entity");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const task_comment_entity_1 = require("../task-comment/task-comment.entity");
const user_entity_1 = require("../user/user.entity");
const task_dto_1 = require("./dtos/task.dto");
let TaskEntity = class TaskEntity extends abstract_entity_1.AbstractEntity {
    static entityName = 'task';
    title;
    description;
    area;
    assignedUsers;
    project;
    sourceTask;
    priority;
    startDate;
    dueDate;
    createdBy;
    status;
    isCheckInPhotoRequired;
    isCheckOutPhotoRequired;
    verifier = null;
    comments;
    subtasks;
};
exports.TaskEntity = TaskEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    tslib_1.__metadata("design:type", String)
], TaskEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => area_entity_1.AreaEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'area_id' }),
    tslib_1.__metadata("design:type", area_entity_1.AreaEntity)
], TaskEntity.prototype, "area", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => task_assignment_entity_1.TaskAssignmentEntity, (taskAssignment) => taskAssignment.task),
    tslib_1.__metadata("design:type", Array)
], TaskEntity.prototype, "assignedUsers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.ProjectEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    tslib_1.__metadata("design:type", project_entity_1.ProjectEntity)
], TaskEntity.prototype, "project", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => daily_scheduled_tasked_entity_1.DailyScheduledTaskEntity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'source_task_id' }),
    tslib_1.__metadata("design:type", daily_scheduled_tasked_entity_1.DailyScheduledTaskEntity)
], TaskEntity.prototype, "sourceTask", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    tslib_1.__metadata("design:type", Number)
], TaskEntity.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    tslib_1.__metadata("design:type", Date)
], TaskEntity.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    tslib_1.__metadata("design:type", Date)
], TaskEntity.prototype, "dueDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], TaskEntity.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: task_status_1.TaskStatus,
        default: task_status_1.TaskStatus.ToDo,
    }),
    tslib_1.__metadata("design:type", String)
], TaskEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], TaskEntity.prototype, "isCheckInPhotoRequired", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], TaskEntity.prototype, "isCheckOutPhotoRequired", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", Object)
], TaskEntity.prototype, "verifier", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => task_comment_entity_1.TaskCommentEntity, (comment) => comment.task),
    tslib_1.__metadata("design:type", Array)
], TaskEntity.prototype, "comments", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => subtask_entity_1.SubtaskEntity, (subtask) => subtask.parentTask),
    tslib_1.__metadata("design:type", Array)
], TaskEntity.prototype, "subtasks", void 0);
exports.TaskEntity = TaskEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('tasks'),
    (0, decorators_1.UseDto)(task_dto_1.TaskDto)
], TaskEntity);
//# sourceMappingURL=task.entity.js.map