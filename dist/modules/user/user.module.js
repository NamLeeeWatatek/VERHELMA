"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const check_in_entity_1 = require("../check-in/check-in.entity");
const location_history_entity_1 = require("../location-history/location-history.entity");
const location_history_service_1 = require("../location-history/location-history.service");
const role_entity_1 = require("../role/role.entity");
const create_settings_command_1 = require("./commands/create-settings.command");
const user_controller_1 = require("./user.controller");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
const user_settings_entity_1 = require("./user-settings.entity");
const handlers = [create_settings_command_1.CreateSettingsHandler];
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                user_settings_entity_1.UserSettingsEntity,
                role_entity_1.RoleEntity,
                user_settings_entity_1.UserSettingsEntity,
                check_in_entity_1.CheckInEntity,
                location_history_entity_1.LocationHistoryEntity,
            ]),
        ],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService],
        providers: [user_service_1.UserService, location_history_service_1.LocationHistoryService, ...handlers],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map