"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtaskEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const task_entity_1 = require("../task/task.entity");
let SubtaskEntity = class SubtaskEntity {
    id;
    content;
    isCompleted;
    parentTask;
};
exports.SubtaskEntity = SubtaskEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], SubtaskEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    tslib_1.__metadata("design:type", String)
], SubtaskEntity.prototype, "content", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], SubtaskEntity.prototype, "isCompleted", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.TaskEntity, (task) => task.subtasks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_task_id' }),
    tslib_1.__metadata("design:type", task_entity_1.TaskEntity)
], SubtaskEntity.prototype, "parentTask", void 0);
exports.SubtaskEntity = SubtaskEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('subtasks')
], SubtaskEntity);
//# sourceMappingURL=subtask.entity.js.map