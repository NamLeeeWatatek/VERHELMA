"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseDto = UseDto;
function UseDto(dtoClass) {
    return (ctor) => {
        if (!dtoClass) {
            throw new Error('UseDto decorator requires dtoClass');
        }
        ctor.prototype.dtoClass = dtoClass;
    };
}
//# sourceMappingURL=use-dto.decorator.js.map