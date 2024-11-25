"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingsEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("../../common/abstract.entity");
const decorators_1 = require("../../decorators");
const user_dto_1 = require("./dtos/user.dto");
const user_entity_1 = require("./user.entity");
let UserSettingsEntity = class UserSettingsEntity extends abstract_entity_1.AbstractEntity {
    isEmailVerified;
    isPhoneVerified;
    userId;
    user;
};
exports.UserSettingsEntity = UserSettingsEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingsEntity.prototype, "isEmailVerified", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingsEntity.prototype, "isPhoneVerified", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], UserSettingsEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, (user) => user.settings, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], UserSettingsEntity.prototype, "user", void 0);
exports.UserSettingsEntity = UserSettingsEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)({ name: 'user_settings' }),
    (0, decorators_1.UseDto)(user_dto_1.UserDto)
], UserSettingsEntity);
//# sourceMappingURL=user-settings.entity.js.map