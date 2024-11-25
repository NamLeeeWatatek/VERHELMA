"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPageResponse = ApiPageResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../common/dto/page.dto");
function ApiPageResponse(options) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(page_dto_1.PageDto), (0, swagger_1.ApiExtraModels)(options.type), (0, swagger_1.ApiOkResponse)({
        description: options.description,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(page_dto_1.PageDto) },
                {
                    properties: {
                        results: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(options.type) },
                        },
                    },
                },
            ],
        },
    }));
}
//# sourceMappingURL=api-page-response.decorator.js.map