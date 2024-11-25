"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class PermissionNotFoundException extends common_1.NotFoundException {
    constructor(error) {
        super('error.permissionNotFound', error);
    }
}
exports.PermissionNotFoundException = PermissionNotFoundException;
//# sourceMappingURL=permission-not-found.exception.js.map