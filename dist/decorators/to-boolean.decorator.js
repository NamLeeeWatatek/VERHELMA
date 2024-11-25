"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBoolean = ToBoolean;
const class_transformer_1 = require("class-transformer");
function ToBoolean() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value === 'true' ? true : value === 'false' ? false : value;
        }
        return value;
    });
}
//# sourceMappingURL=to-boolean.decorator.js.map