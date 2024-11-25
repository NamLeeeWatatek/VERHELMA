"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const project_status_enum_1 = require("../../constants/project-status.enum");
const decorators_1 = require("../../decorators");
const farm_entity_1 = require("../farm/farm.entity");
const user_entity_1 = require("../user/user.entity");
const user_project_entity_1 = require("../user-project/user-project.entity");
const project_dto_1 = require("./dtos/project.dto");
let ProjectEntity = class ProjectEntity extends abstract_entity_1.AbstractEntity {
    static entityName = 'project';
    name;
    description;
    createdBy;
    farm;
    status;
    users;
};
exports.ProjectEntity = ProjectEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: false }),
    tslib_1.__metadata("design:type", String)
], ProjectEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProjectEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], ProjectEntity.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => farm_entity_1.FarmEntity),
    tslib_1.__metadata("design:type", farm_entity_1.FarmEntity)
], ProjectEntity.prototype, "farm", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: project_status_enum_1.ProjectStatus,
        default: project_status_enum_1.ProjectStatus.NOT_STARTED,
    }),
    tslib_1.__metadata("design:type", String)
], ProjectEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => user_project_entity_1.UserProjectEntity, (userProject) => userProject.project),
    tslib_1.__metadata("design:type", Array)
], ProjectEntity.prototype, "users", void 0);
exports.ProjectEntity = ProjectEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('projects'),
    (0, decorators_1.UseDto)(project_dto_1.ProjectDto)
], ProjectEntity);
//# sourceMappingURL=project.entity.js.map