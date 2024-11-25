"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInDto = void 0;
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class ClockInDto {
    user;
    clockInImageUrls;
    clockOutImageUrls;
    clockInLatitude;
    clockInLongitude;
    clockOutLatitude;
    clockOutLongitude;
    clockInTime;
    clockOutTime;
    constructor(clockIn) {
        this.user = new user_basic_response_dto_1.UserBasicDto(clockIn.user);
        this.clockInImageUrls = clockIn.clockInImageUrls;
        this.clockOutImageUrls = clockIn.clockOutImageUrls;
        this.clockInLatitude = clockIn.clockInLatitude;
        this.clockInLongitude = clockIn.clockInLongitude;
        this.clockOutLatitude = clockIn.clockOutLatitude;
        this.clockOutLongitude = clockIn.clockOutLongitude;
        this.clockInTime = clockIn.clockInTime;
        this.clockOutTime = clockIn.clockOutTime;
    }
}
exports.ClockInDto = ClockInDto;
//# sourceMappingURL=clock-in.dto.js.map