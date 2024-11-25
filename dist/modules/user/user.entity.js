"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const account_status_1 = require("../../constants/account-status");
const decorators_1 = require("../../decorators");
const role_entity_1 = require("../role/role.entity");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const user_project_entity_1 = require("../user-project/user-project.entity");
const user_dto_1 = require("./dtos/user.dto");
const user_settings_entity_1 = require("./user-settings.entity");
let UserEntity = class UserEntity extends abstract_entity_1.AbstractEntity {
    static entityName = 'user';
    userName;
    firstName;
    lastName;
    role;
    accountStatus;
    email;
    password;
    phoneNumber;
    avatar;
    birthday;
    supervisor = null;
    subordinates;
    fullName;
    settings;
    lastLogin;
    deviceToken;
    latitude;
    longitude;
    taskAssignments;
    projects;
};
exports.UserEntity = UserEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "userName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.RoleEntity, (role) => role.users, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: account_status_1.AccountStatus,
        default: account_status_1.AccountStatus.INACTIVE,
    }),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "accountStatus", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true, type: 'varchar' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true, type: 'varchar' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "avatar", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'date' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "birthday", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (user) => user.subordinates, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "supervisor", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => UserEntity, (user) => user.supervisor),
    tslib_1.__metadata("design:type", Array)
], UserEntity.prototype, "subordinates", void 0);
tslib_1.__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
    }),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => user_settings_entity_1.UserSettingsEntity, (userSettings) => userSettings.user),
    tslib_1.__metadata("design:type", user_settings_entity_1.UserSettingsEntity)
], UserEntity.prototype, "settings", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "lastLogin", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "deviceToken", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'decimal', precision: 9, scale: 6 }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "latitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'decimal', precision: 9, scale: 6 }),
    tslib_1.__metadata("design:type", Object)
], UserEntity.prototype, "longitude", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => task_assignment_entity_1.TaskAssignmentEntity, (taskAssignment) => taskAssignment.user),
    tslib_1.__metadata("design:type", Array)
], UserEntity.prototype, "taskAssignments", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => user_project_entity_1.UserProjectEntity, (userProject) => userProject.user),
    tslib_1.__metadata("design:type", Array)
], UserEntity.prototype, "projects", void 0);
exports.UserEntity = UserEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({ name: 'users' }),
    (0, decorators_1.UseDto)(user_dto_1.UserDto)
], UserEntity);
//# sourceMappingURL=user.entity.js.map