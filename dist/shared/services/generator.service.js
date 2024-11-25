"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let GeneratorService = class GeneratorService {
    uuid() {
        return (0, uuid_1.v1)();
    }
    fileName(ext) {
        return this.uuid() + '.' + ext;
    }
};
exports.GeneratorService = GeneratorService;
exports.GeneratorService = GeneratorService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], GeneratorService);
//# sourceMappingURL=generator.service.js.map