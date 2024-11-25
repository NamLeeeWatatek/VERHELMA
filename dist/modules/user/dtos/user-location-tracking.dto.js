"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLocationTrackingDto = void 0;
const location_dto_1 = require("../../../shared/dtos/location.dto");
class UserLocationTrackingDto {
    location;
    lastSeen;
    constructor() {
        this.location = new location_dto_1.LocationDto(0, 0);
        this.lastSeen = new Date();
    }
}
exports.UserLocationTrackingDto = UserLocationTrackingDto;
//# sourceMappingURL=user-location-tracking.dto.js.map