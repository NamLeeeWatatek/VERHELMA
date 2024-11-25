"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class TaskNotFoundException extends common_1.NotFoundException {
    constructor(error) {
        super('error.taskNotFound', error);
    }
}
exports.TaskNotFoundException = TaskNotFoundException;
//# sourceMappingURL=task-not-found.exception.js.map