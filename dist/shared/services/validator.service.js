"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let ValidatorService = class ValidatorService {
    isImage(mimeType) {
        const imageMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp',
            'image/webp',
            'image/svg+xml',
            'image/tiff',
            'image/x-icon',
            'application/octet-stream',
        ];
        return imageMimeTypes.includes(mimeType);
    }
    isDocument(mimeType) {
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return allowedMimeTypes.includes(mimeType);
    }
};
exports.ValidatorService = ValidatorService;
exports.ValidatorService = ValidatorService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ValidatorService);
//# sourceMappingURL=validator.service.js.map