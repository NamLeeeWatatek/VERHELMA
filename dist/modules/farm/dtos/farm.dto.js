"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
const user_basic_response_dto_1 = require("../../user/dtos/user-basic.response.dto");
class FarmDto extends abstract_dto_1.AbstractDto {
    name;
    description;
    farmManager;
    constructor(farmEntity) {
        super(farmEntity);
        this.name = farmEntity.name;
        this.description = farmEntity.description;
        this.farmManager = farmEntity.farmManager
            ? new user_basic_response_dto_1.UserBasicDto(farmEntity.farmManager)
            : null;
    }
}
exports.FarmDto = FarmDto;
//# sourceMappingURL=farm.dto.js.map