"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSettingsHandler = exports.CreateSettingsCommand = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_settings_entity_1 = require("../user-settings.entity");
class CreateSettingsCommand {
    userId;
    createSettingsDto;
    constructor(userId, createSettingsDto) {
        this.userId = userId;
        this.createSettingsDto = createSettingsDto;
    }
}
exports.CreateSettingsCommand = CreateSettingsCommand;
let CreateSettingsHandler = class CreateSettingsHandler {
    userSettingsRepository;
    constructor(userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }
    execute(command) {
        const { userId, createSettingsDto } = command;
        const userSettingsEntity = this.userSettingsRepository.create(createSettingsDto);
        userSettingsEntity.userId = userId;
        return this.userSettingsRepository.save(userSettingsEntity);
    }
};
exports.CreateSettingsHandler = CreateSettingsHandler;
exports.CreateSettingsHandler = CreateSettingsHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(CreateSettingsCommand),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_settings_entity_1.UserSettingsEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], CreateSettingsHandler);
//# sourceMappingURL=create-settings.command.js.map