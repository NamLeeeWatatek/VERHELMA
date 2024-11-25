"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const page_dto_1 = require("../../common/dto/page.dto");
const page_options_dto_1 = require("../../common/dto/page-options.dto");
const decorators_1 = require("../../decorators");
const auth_guard_1 = require("../../guards/auth.guard");
const project_dto_1 = require("./dtos/project.dto");
const project_request_dto_1 = require("./dtos/project.request.dto");
const project_create_dto_1 = require("./dtos/project-create.dto");
const project_service_1 = require("./project.service");
let ProjectController = class ProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    async createProject(projectCreateDto) {
        const permissionEntity = await this.projectService.createProject(projectCreateDto);
        return permissionEntity.toDto();
    }
    getProjects(pageOptionsDto) {
        return this.projectService.getProjects(pageOptionsDto);
    }
    getProjectsByFarmId(farmId) {
        return this.projectService.getProjectsByFarmId(farmId);
    }
    getProject(projectId) {
        return this.projectService.getProject(projectId);
    }
    updateProject(id, projectUpdateDto) {
        return this.projectService.updateProject(id, projectUpdateDto);
    }
    addUsers(id, dto) {
        return this.projectService.addUsersToProject(id, dto.userIds);
    }
    removeUsers(id, dto) {
        return this.projectService.removeUsersFromProject(id, dto.userIds);
    }
    getMembers(projectId) {
        return this.projectService.getMembers(projectId);
    }
    async deleteProject(id) {
        await this.projectService.deleteProject(id);
    }
};
exports.ProjectController = ProjectController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Create new project', type: project_dto_1.ProjectDto }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [project_create_dto_1.ProjectCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "createProject", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.ApiPageResponse)({
        description: 'Get projects list',
        type: page_dto_1.PageDto,
    }),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjects", null);
tslib_1.__decorate([
    (0, common_1.Get)('/all/:farmId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('farmId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectsByFarmId", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)({ public: false })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get project by id',
        type: project_dto_1.ProjectDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "getProject", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project updated successfully!',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, project_create_dto_1.ProjectCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
tslib_1.__decorate([
    (0, common_1.Put)('add-users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project updated successfully!',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, project_request_dto_1.AddUsersDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "addUsers", null);
tslib_1.__decorate([
    (0, common_1.Put)('remove-users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project updated successfully!',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, project_request_dto_1.AddUsersDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "removeUsers", null);
tslib_1.__decorate([
    (0, common_1.Get)('members/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Get project member by project id',
        type: project_dto_1.ProjectDto,
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "getMembers", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Project deleted successfully!',
    }),
    tslib_1.__param(0, (0, decorators_1.UUIDParam)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteProject", null);
exports.ProjectController = ProjectController = tslib_1.__decorate([
    (0, common_1.Controller)('projects'),
    (0, swagger_1.ApiTags)('projects'),
    tslib_1.__metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map