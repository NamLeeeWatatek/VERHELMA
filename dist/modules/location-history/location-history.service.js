"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHistoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_history_basic_dto_1 = require("./dtos/location-history-basic.dto");
const location_history_entity_1 = require("./location-history.entity");
let LocationHistoryService = class LocationHistoryService {
    locationHistoryRepository;
    constructor(locationHistoryRepository) {
        this.locationHistoryRepository = locationHistoryRepository;
    }
    async create(user, location) {
        const record = this.locationHistoryRepository.create();
        record.latitude = location.latitude;
        record.longitude = location.longitude;
        record.user = user;
        await this.locationHistoryRepository.save(record);
    }
    async getHistory(userId, date) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        const history = await this.locationHistoryRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(startOfDay, endOfDay),
                user: { id: userId },
            },
            order: { createdAt: 'ASC' },
        });
        return history.map((record) => new location_history_basic_dto_1.LocationHistoryBasicDto(record));
    }
};
exports.LocationHistoryService = LocationHistoryService;
exports.LocationHistoryService = LocationHistoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(location_history_entity_1.LocationHistoryEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], LocationHistoryService);
//# sourceMappingURL=location-history.service.js.map