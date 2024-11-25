"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const utils_1 = require("../common/utils");
const user_entity_1 = require("../modules/user/user.entity");
let UserSubscriber = class UserSubscriber {
    listenTo() {
        return user_entity_1.UserEntity;
    }
    beforeInsert(event) {
        if (event.entity.password) {
            event.entity.password = (0, utils_1.generateHash)(event.entity.password);
        }
    }
    beforeUpdate(event) {
        const entity = event.entity;
        if (entity.password !== event.databaseEntity.password) {
            entity.password = (0, utils_1.generateHash)(entity.password);
        }
    }
};
exports.UserSubscriber = UserSubscriber;
exports.UserSubscriber = UserSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], UserSubscriber);
//# sourceMappingURL=user-subscriber.js.map