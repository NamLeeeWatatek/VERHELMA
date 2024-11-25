"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInDto = void 0;
class CheckInDto {
    userId;
    taskId;
    checkInImageUrls;
    checkOutImageUrls;
    checkInLatitude;
    checkInLongitude;
    checkOutLatitude;
    checkOutLongitude;
    checkInTime;
    checkOutTime;
    constructor(checkIn) {
        this.userId = checkIn.userId;
        this.taskId = checkIn.taskId;
        this.checkInImageUrls = checkIn.checkInImageUrls;
        this.checkOutImageUrls = checkIn.checkOutImageUrls;
        this.checkInLatitude = checkIn.checkInLatitude;
        this.checkInLongitude = checkIn.checkInLongitude;
        this.checkOutLatitude = checkIn.checkOutLatitude;
        this.checkOutLongitude = checkIn.checkOutLongitude;
        this.checkInTime = checkIn.checkInTime;
        this.checkOutTime = checkIn.checkOutTime;
    }
}
exports.CheckInDto = CheckInDto;
//# sourceMappingURL=check-in.dto.js.map