"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const farm_dto_1 = require("./dtos/farm.dto");
const farm_create_dto_1 = require("./dtos/farm-create.dto");
const farm_service_1 = require("./farm.service");
let FarmController = class FarmController {
    farmService;
    constructor(farmService) {
        this.farmService = farmService;
    }
    async createFarm(farmCreateDto) {
        const farmEntity = await this.farmService.createFarm(farmCreateDto);
        return farmEntity.toDto();
    }
    getFarms(pageOptionsDto) {
        return this.farmService.getFarms(pageOptionsDto);
    }
    getAllFarms() {
        return this.farmService.getAllFarms();
    }
    getFarm(farmId) {
        return this.farmService.getFarm(farmId);
    }
    updateFarm(id, farmUpdateDto) {
        return this.farmService.updateFarm(id, farmUpdateDto);
    }
    async deleteFarm(id) {
        await this.farmService.deleteFarm(id);
    }
};
exports.FarmController = FarmController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new farm' }),
    (0, swagger_1.ApiCreatedResponse)({ type: farm_dto_1.FarmDto }),
    (0, swagger_1.ApiBody)({
        type: farm_create_dto_1.FarmCreateDto,
        description: 'Details of the Farm to be created',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [farm_create_dto_1.FarmCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], FarmController.prototype, "createFarm", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of farms' }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get farms list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], FarmController.prototype, "getFarms", null);
tslib_1.__decorate([
    (0, common_1.Get)('/all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of farms' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FarmController.prototype, "getAllFarms", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific farm by its ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the farm to retrieve' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get farm',
        type: farm_dto_1.FarmDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FarmController.prototype, "getFarm", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing farm' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the farm to update' }),
    (0, swagger_1.ApiBody)({
        type: farm_create_dto_1.FarmCreateDto,
        description: 'Updated farm data',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Farm updated successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, farm_create_dto_1.FarmCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], FarmController.prototype, "updateFarm", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific farm' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the farm to delete' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Farm deleted successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FarmController.prototype, "deleteFarm", null);
exports.FarmController = FarmController = tslib_1.__decorate([
    (0, common_1.Controller)('farms'),
    (0, swagger_1.ApiTags)('farms'),
    tslib_1.__metadata("design:paramtypes", [farm_service_1.FarmService])
], FarmController);
//# sourceMappingURL=farm.controller.js.map