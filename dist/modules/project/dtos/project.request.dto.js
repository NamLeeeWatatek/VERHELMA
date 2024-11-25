"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUsersDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddUsersDto {
    userIds = [];
}
exports.AddUsersDto = AddUsersDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], AddUsersDto.prototype, "userIds", void 0);
//# sourceMappingURL=project.request.dto.js.map