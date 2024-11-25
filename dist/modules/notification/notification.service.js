"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const notification_create_dto_1 = require("./dtos/notification-create.dto");
const notification_entity_1 = require("./notification.entity");
let NotificationService = class NotificationService {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async createNotification(userId, notificationCreateDto) {
        const notification = this.notificationRepository.create(notificationCreateDto);
        notification.userId = userId;
        await this.notificationRepository.save(notification);
        return notification;
    }
    async createNotificationForManyUsers(userIds, notificationCreateDto) {
        const notifications = [];
        for (const userId of userIds) {
            const notification = this.notificationRepository.create(notificationCreateDto);
            notification.userId = userId;
            notifications.push(notification);
        }
        await this.notificationRepository.save(notifications);
        return notifications;
    }
    async getNotificationsByUserId(userId, pageOptionsDto) {
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
        queryBuilder
            .where('notification.userId = :userId', { userId })
            .orderBy('notification.createdAt', 'DESC');
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
};
exports.NotificationService = NotificationService;
tslib_1.__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, notification_create_dto_1.NotificationCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationService.prototype, "createNotification", null);
exports.NotificationService = NotificationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map