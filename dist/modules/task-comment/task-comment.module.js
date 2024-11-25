"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCommentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
const task_comment_controller_1 = require("./task-comment.controller");
const task_comment_entity_1 = require("./task-comment.entity");
const task_comment_service_1 = require("./task-comment.service");
let TaskCommentModule = class TaskCommentModule {
};
exports.TaskCommentModule = TaskCommentModule;
exports.TaskCommentModule = TaskCommentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([task_comment_entity_1.TaskCommentEntity, task_entity_1.TaskEntity, user_entity_1.UserEntity]),
        ],
        providers: [task_comment_service_1.TaskCommentService],
        controllers: [task_comment_controller_1.TaskCommentController],
    })
], TaskCommentModule);
//# sourceMappingURL=task-comment.module.js.map