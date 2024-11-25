"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHistoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const location_history_controller_1 = require("./location-history.controller");
const location_history_entity_1 = require("./location-history.entity");
const location_history_service_1 = require("./location-history.service");
let LocationHistoryModule = class LocationHistoryModule {
};
exports.LocationHistoryModule = LocationHistoryModule;
exports.LocationHistoryModule = LocationHistoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([location_history_entity_1.LocationHistoryEntity])],
        controllers: [location_history_controller_1.LocationHistoryController],
        exports: [location_history_service_1.LocationHistoryService],
        providers: [location_history_service_1.LocationHistoryService],
    })
], LocationHistoryModule);
//# sourceMappingURL=location-history.module.js.map