"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtaskNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class SubtaskNotFoundException extends common_1.HttpException {
    constructor() {
        super('Subtask not found or does not belong to this task', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.SubtaskNotFoundException = SubtaskNotFoundException;
//# sourceMappingURL=subtask-not-found-exception.js.map