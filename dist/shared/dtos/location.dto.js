"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LocationDto {
    latitude = 0;
    longitude = 0;
    constructor(latitude, longitude) {
        this.latitude = latitude ?? 0;
        this.longitude = longitude ?? 0;
    }
}
exports.LocationDto = LocationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Object)
], LocationDto.prototype, "latitude", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Object)
], LocationDto.prototype, "longitude", void 0);
//# sourceMappingURL=location.dto.js.map