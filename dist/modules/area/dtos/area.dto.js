"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaDto = void 0;
const abstract_dto_1 = require("../../../common/dto/abstract.dto");
class AreaDto extends abstract_dto_1.AbstractDto {
    name;
    latitude;
    longitude;
    description;
    constructor(area) {
        super(area);
        this.name = area.name;
        this.latitude = area.latitude;
        this.longitude = area.longitude;
        this.description = area.description;
    }
}
exports.AreaDto = AreaDto;
//# sourceMappingURL=area.dto.js.map