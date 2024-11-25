"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const area_service_1 = require("./area.service");
const area_dto_1 = require("./dtos/area.dto");
const area_create_dto_1 = require("./dtos/area-create.dto");
let AreaController = class AreaController {
    areaService;
    constructor(areaService) {
        this.areaService = areaService;
    }
    async createArea(areaCreateDto) {
        const areaEntity = await this.areaService.createArea(areaCreateDto);
        return new area_dto_1.AreaDto(areaEntity);
    }
    getAreas(pageOptionsDto) {
        return this.areaService.getAreas(pageOptionsDto);
    }
    getArea(areaId) {
        return this.areaService.getArea(areaId);
    }
    updateArea(id, areaUpdateDto) {
        return this.areaService.updateArea(id, areaUpdateDto);
    }
    async deleteArea(id) {
        await this.areaService.deleteArea(id);
    }
};
exports.AreaController = AreaController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new area' }),
    (0, swagger_1.ApiCreatedResponse)({ type: area_dto_1.AreaDto }),
    (0, swagger_1.ApiBody)({
        type: area_create_dto_1.AreaCreateDto,
        description: 'Details of the area to be created',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [area_create_dto_1.AreaCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AreaController.prototype, "createArea", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of areas' }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get areas list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AreaController.prototype, "getAreas", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific area by its ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the area to retrieve' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get area',
        type: area_dto_1.AreaDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AreaController.prototype, "getArea", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing area' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the area to update' }),
    (0, swagger_1.ApiBody)({
        type: area_create_dto_1.AreaCreateDto,
        description: 'Updated area data',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Area updated successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, area_create_dto_1.AreaCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AreaController.prototype, "updateArea", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific area' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the area to delete' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Area deleted successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AreaController.prototype, "deleteArea", null);
exports.AreaController = AreaController = tslib_1.__decorate([
    (0, common_1.Controller)('areas'),
    (0, swagger_1.ApiTags)('areas'),
    tslib_1.__metadata("design:paramtypes", [area_service_1.AreaService])
], AreaController);
//# sourceMappingURL=area.controller.js.map