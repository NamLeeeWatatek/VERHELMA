"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHistoryDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class LocationHistoryDto extends abstract_dto_1.AbstractDto {
    latitude;
    longitude;
    user;
    constructor(locationHistory) {
        super(locationHistory);
        this.latitude = locationHistory.latitude;
        this.longitude = locationHistory.longitude;
        this.user = locationHistory.user
            ? new user_basic_response_dto_1.UserBasicDto(locationHistory.user)
            : null;
    }
}
exports.LocationHistoryDto = LocationHistoryDto;
//# sourceMappingURL=location-history.dto.js.map