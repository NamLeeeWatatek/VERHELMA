"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
class NotificationDto extends abstract_dto_1.AbstractDto {
    userId;
    title;
    body;
    data;
    type;
    isRead;
    constructor(notfication) {
        super(notfication);
        this.userId = notfication.userId;
        this.title = notfication.title;
        this.body = notfication.body;
        this.data = notfication.data;
        this.type = notfication.type;
        this.isRead = notfication.isRead;
        this.createdAt = notfication.createdAt;
    }
}
exports.NotificationDto = NotificationDto;
//# sourceMappingURL=notification.dto.js.map