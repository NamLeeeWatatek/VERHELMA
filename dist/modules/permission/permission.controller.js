"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const permission_dto_1 = require("./dtos/permission.dto");
const permission_create_dto_1 = require("./dtos/permission-create.dto");
const permission_service_1 = require("./permission.service");
let PermissionController = class PermissionController {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    async createPermission(permissionCreateDto) {
        const permissionEntity = await this.permissionService.createPermission(permissionCreateDto);
        return permissionEntity.toDto();
    }
    getPermissions(pageOptionsDto) {
        return this.permissionService.getPermissions(pageOptionsDto);
    }
    getPermission(permissionId) {
        return this.permissionService.getPermission(permissionId);
    }
    updatePermission(id, permissionUpdateDto) {
        return this.permissionService.updatePermission(id, permissionUpdateDto);
    }
    async deletePermission(id) {
        await this.permissionService.deletePermission(id);
    }
    async generatePermissions() {
        await this.permissionService.generatePermissions();
    }
};
exports.PermissionController = PermissionController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new permission' }),
    (0, swagger_1.ApiCreatedResponse)({ type: permission_dto_1.PermissionDto }),
    (0, swagger_1.ApiBody)({
        type: permission_create_dto_1.PermissionCreateDto,
        description: 'Details of the permission to be created',
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [permission_create_dto_1.PermissionCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionController.prototype, "createPermission", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated list of permissions' }),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get permissions list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermissions", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific permission by its ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the permission to retrieve' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get permission',
        type: permission_dto_1.PermissionDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermission", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the permission to update' }),
    (0, swagger_1.ApiBody)({
        type: permission_create_dto_1.PermissionCreateDto,
        description: 'Updated permission data',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Permission updated successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, permission_create_dto_1.PermissionCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionController.prototype, "updatePermission", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the permission to delete' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Permission deleted successfully' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionController.prototype, "deletePermission", null);
tslib_1.__decorate([
    (0, common_1.Post)('generate-permissions'),
    (0, common_1.SetMetadata)('skipAuth', true),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionController.prototype, "generatePermissions", null);
exports.PermissionController = PermissionController = tslib_1.__decorate([
    (0, common_1.Controller)('permissions'),
    (0, swagger_1.ApiTags)('permissions'),
    tslib_1.__metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map