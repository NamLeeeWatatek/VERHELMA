"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiBooleanProperty = ApiBooleanProperty;
exports.ApiBooleanPropertyOptional = ApiBooleanPropertyOptional;
exports.ApiUUIDProperty = ApiUUIDProperty;
exports.ApiUUIDPropertyOptional = ApiUUIDPropertyOptional;
exports.ApiEnumProperty = ApiEnumProperty;
exports.ApiEnumPropertyOptional = ApiEnumPropertyOptional;
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("../common/utils");
function ApiBooleanProperty(options = {}) {
    return (0, swagger_1.ApiProperty)({ type: Boolean, ...options });
}
function ApiBooleanPropertyOptional(options = {}) {
    return ApiBooleanProperty({ required: false, ...options });
}
function ApiUUIDProperty(options = {}) {
    return (0, swagger_1.ApiProperty)({
        type: options.each ? [String] : String,
        format: 'uuid',
        isArray: options.each,
        ...options,
    });
}
function ApiUUIDPropertyOptional(options = {}) {
    return ApiUUIDProperty({ required: false, ...options });
}
function ApiEnumProperty(getEnum, options = {}) {
    const enumValue = getEnum();
    return (0, swagger_1.ApiProperty)({
        type: 'enum',
        enum: enumValue,
        enumName: (0, utils_1.getVariableName)(getEnum),
        ...options,
    });
}
function ApiEnumPropertyOptional(getEnum, options = {}) {
    return ApiEnumProperty(getEnum, { required: false, ...options });
}
//# sourceMappingURL=property.decorators.js.map