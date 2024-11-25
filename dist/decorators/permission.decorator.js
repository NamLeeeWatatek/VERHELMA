"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const common_1 = require("@nestjs/common");
const Permission = (action, entity) => (0, common_1.SetMetadata)('permission', `${entity.entityName}:${action}`);
exports.Permission = Permission;
//# sourceMappingURL=permission.decorator.js.map