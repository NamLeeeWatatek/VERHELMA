"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmInfoDto = void 0;
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class FarmInfoDto {
    id;
    name;
    description;
    farmManager;
    constructor(farmEntity) {
        this.id = farmEntity.id;
        this.name = farmEntity.name;
        this.description = farmEntity.description;
        this.farmManager = farmEntity.farmManager
            ? new user_basic_response_dto_1.UserBasicDto(farmEntity.farmManager)
            : null;
    }
}
exports.FarmInfoDto = FarmInfoDto;
//# sourceMappingURL=farm-info.dto.js.map