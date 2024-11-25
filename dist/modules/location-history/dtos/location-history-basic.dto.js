"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHistoryBasicDto = void 0;
class LocationHistoryBasicDto {
    latitude;
    longitude;
    createdAt;
    constructor(location) {
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        this.createdAt = location.createdAt;
    }
}
exports.LocationHistoryBasicDto = LocationHistoryBasicDto;
//# sourceMappingURL=location-history-basic.dto.js.map