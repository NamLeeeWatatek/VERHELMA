"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_controller_1 = require("./notification.controller");
const notification_entity_1 = require("./notification.entity");
const notification_service_1 = require("./notification.service");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notification_entity_1.NotificationEntity])],
        controllers: [notification_controller_1.NotificationController],
        exports: [notification_service_1.NotificationService],
        providers: [notification_service_1.NotificationService],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map