"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCommentEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
let TaskCommentEntity = class TaskCommentEntity {
    id;
    task;
    user;
    comment;
    createdAt;
};
exports.TaskCommentEntity = TaskCommentEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], TaskCommentEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.TaskEntity, (task) => task.comments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    tslib_1.__metadata("design:type", task_entity_1.TaskEntity)
], TaskCommentEntity.prototype, "task", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], TaskCommentEntity.prototype, "user", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text'),
    tslib_1.__metadata("design:type", String)
], TaskCommentEntity.prototype, "comment", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    tslib_1.__metadata("design:type", Date)
], TaskCommentEntity.prototype, "createdAt", void 0);
exports.TaskCommentEntity = TaskCommentEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('task_comments')
], TaskCommentEntity);
//# sourceMappingURL=task-comment.entity.js.map