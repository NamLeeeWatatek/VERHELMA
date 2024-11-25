"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssignmentEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
let TaskAssignmentEntity = class TaskAssignmentEntity {
    static entityName = 'task_assignment';
    taskId;
    userId;
    task;
    user;
};
exports.TaskAssignmentEntity = TaskAssignmentEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'task_id' }),
    tslib_1.__metadata("design:type", String)
], TaskAssignmentEntity.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", String)
], TaskAssignmentEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.TaskEntity, (task) => task.assignedUsers, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id', referencedColumnName: 'id' }),
    tslib_1.__metadata("design:type", task_entity_1.TaskEntity)
], TaskAssignmentEntity.prototype, "task", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.taskAssignments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'id' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], TaskAssignmentEntity.prototype, "user", void 0);
exports.TaskAssignmentEntity = TaskAssignmentEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('task_assignments')
], TaskAssignmentEntity);
//# sourceMappingURL=task-assignment.entity.js.map