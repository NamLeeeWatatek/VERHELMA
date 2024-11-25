"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCommentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../task/task.entity");
const user_entity_1 = require("../user/user.entity");
const task_comment_dto_1 = require("./dtos/task-comment.dto");
const task_comment_entity_1 = require("./task-comment.entity");
let TaskCommentService = class TaskCommentService {
    taskCommentRepository;
    taskRepository;
    userRepository;
    constructor(taskCommentRepository, taskRepository, userRepository) {
        this.taskCommentRepository = taskCommentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    async createComment(dto) {
        const task = await this.taskRepository.findOne({
            where: { id: dto.taskId },
        });
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const taskComment = this.taskCommentRepository.create({
            comment: dto.comment,
            task,
            user,
        });
        return this.taskCommentRepository.save(taskComment);
    }
    async getCommentsByTaskId(taskId) {
        const comments = await this.taskCommentRepository.find({
            where: {
                task: {
                    id: taskId,
                },
            },
            relations: ['task', 'user'],
        });
        return comments.map((comment) => new task_comment_dto_1.TaskCommentDto(comment));
    }
    async updateTaskComment(id, taskCommentUpdateDto) {
        const taskComment = await this.taskCommentRepository.findOne({
            where: { id },
        });
        if (!taskComment) {
            throw new common_1.NotFoundException('Task comment not found');
        }
        taskComment.comment = taskCommentUpdateDto.comment;
        await this.taskCommentRepository.save(taskComment);
    }
    async deleteTaskComment(id) {
        const taskComment = await this.taskCommentRepository.findOne({
            where: { id },
        });
        if (!taskComment) {
            throw new common_1.NotFoundException('Task comment not found');
        }
        await this.taskCommentRepository.remove(taskComment);
    }
};
exports.TaskCommentService = TaskCommentService;
exports.TaskCommentService = TaskCommentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_comment_entity_1.TaskCommentEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(task_entity_1.TaskEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TaskCommentService);
//# sourceMappingURL=task-comment.service.js.map