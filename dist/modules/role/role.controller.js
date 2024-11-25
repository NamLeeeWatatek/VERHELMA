"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const role_dto_1 = require("./dtos/role.dto");
const role_create_dto_1 = require("./dtos/role-create.dto");
const role_service_1 = require("./role.service");
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async createRole(roleCreateDto) {
        const roleEntity = await this.roleService.createRole(roleCreateDto);
        return roleEntity.toDto();
    }
    getRoles(pageOptionsDto) {
        return this.roleService.getRoles(pageOptionsDto);
    }
    getRole(id) {
        return this.roleService.getRole(id);
    }
    getPermissionsByRoleId(id) {
        return this.roleService.getPermissions(id);
    }
    updateRole(id, roleUpdateDto) {
        return this.roleService.updateRole(id, roleUpdateDto);
    }
    async deleteRole(id) {
        return this.roleService.deleteRole(id);
    }
};
exports.RoleController = RoleController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Create new role', type: role_dto_1.RoleDto }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [role_create_dto_1.RoleCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "createRole", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get roles list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "getRoles", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get role',
        type: role_dto_1.RoleDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "getRole", null);
tslib_1.__decorate([
    (0, common_1.Get)('/permissions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get permission by role id',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "getPermissionsByRoleId", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'Role updated successfully!' }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, role_create_dto_1.RoleCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "updateRole", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Role deleted successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Role not found',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "deleteRole", null);
exports.RoleController = RoleController = tslib_1.__decorate([
    (0, common_1.Controller)('roles'),
    (0, swagger_1.ApiTags)('roles'),
    tslib_1.__metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map