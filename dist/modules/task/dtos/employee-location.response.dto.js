"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLocationDto = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("../../../decorators");
const location_dto_1 = require("../../../shared/dtos/location.dto");
const user_dto_1 = require("../../user/dtos/user.dto");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class EmployeeLocationDto {
    user;
    location;
    constructor(user) {
        this.user = new user_basic_response_dto_1.UserBasicDto(user);
        this.location = new location_dto_1.LocationDto(user.latitude, user.longitude);
    }
}
exports.EmployeeLocationDto = EmployeeLocationDto;
tslib_1.__decorate([
    (0, decorators_1.ClassField)(() => user_dto_1.UserDto),
    tslib_1.__metadata("design:type", user_basic_response_dto_1.UserBasicDto)
], EmployeeLocationDto.prototype, "user", void 0);
tslib_1.__decorate([
    (0, decorators_1.ClassField)(() => location_dto_1.LocationDto),
    tslib_1.__metadata("design:type", location_dto_1.LocationDto)
], EmployeeLocationDto.prototype, "location", void 0);
//# sourceMappingURL=employee-location.response.dto.js.map