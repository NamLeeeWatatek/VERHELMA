"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const project_entity_1 = require("../project/project.entity");
const user_entity_1 = require("../user/user.entity");
let UserProjectEntity = class UserProjectEntity {
    userId;
    projectId;
    user;
    project;
};
exports.UserProjectEntity = UserProjectEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", String)
], UserProjectEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'project_id' }),
    tslib_1.__metadata("design:type", String)
], UserProjectEntity.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.projects, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'id' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], UserProjectEntity.prototype, "user", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.ProjectEntity, (project) => project.users, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'project_id', referencedColumnName: 'id' }),
    tslib_1.__metadata("design:type", project_entity_1.ProjectEntity)
], UserProjectEntity.prototype, "project", void 0);
exports.UserProjectEntity = UserProjectEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('user_projects')
], UserProjectEntity);
//# sourceMappingURL=user-project.entity.js.map