"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class ProjectNotFoundException extends common_1.NotFoundException {
    constructor(error) {
        super('error.projectNotFound', error);
    }
}
exports.ProjectNotFoundException = ProjectNotFoundException;
//# sourceMappingURL=project-not-found.exception.js.map