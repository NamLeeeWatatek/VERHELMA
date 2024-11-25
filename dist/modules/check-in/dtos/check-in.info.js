"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInInfo = void 0;
class CheckInInfo {
    checkInTime;
    checkOutTime;
    workDuration;
    checkInLocation;
    checkOutLocation;
    checkInImages;
    checkOutImages;
    constructor(checkIn) {
        this.checkInTime = checkIn.checkInTime;
        this.checkOutTime = checkIn.checkOutTime;
        if (this.checkOutTime) {
            const diff = (this.checkOutTime.getTime() - this.checkInTime.getTime()) / 1000 / 60;
            this.workDuration = Math.max(0, diff);
        }
        else {
            this.workDuration = 0;
        }
        this.checkInLocation =
            checkIn.checkInLatitude && checkIn.checkInLongitude
                ? {
                    latitude: checkIn.checkInLatitude,
                    longitude: checkIn.checkInLongitude,
                }
                : null;
        this.checkOutLocation =
            checkIn.checkOutLatitude && checkIn.checkOutLongitude
                ? {
                    latitude: checkIn.checkOutLatitude,
                    longitude: checkIn.checkOutLongitude,
                }
                : null;
        this.checkInImages = checkIn.checkInImageUrls ?? [];
        this.checkOutImages = checkIn.checkOutImageUrls ?? [];
    }
}
exports.CheckInInfo = CheckInInfo;
//# sourceMappingURL=check-in.info.js.map