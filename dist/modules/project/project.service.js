"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const utils_1 = require("../../common/utils");
const farm_entity_1 = require("../farm/farm.entity");
const user_basic_response_dto_1 = require("../user/dtos/user-basic.response.dto");
const user_entity_1 = require("../user/user.entity");
const user_project_entity_1 = require("../user-project/user-project.entity");
const project_create_dto_1 = require("./dtos/project-create.dto");
const project_not_found_exception_1 = require("./exceptions/project-not-found.exception");
const project_entity_1 = require("./project.entity");
let ProjectService = class ProjectService {
    projectRepository;
    farmRepository;
    userProjectRepository;
    userRepository;
    constructor(projectRepository, farmRepository, userProjectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.farmRepository = farmRepository;
        this.userProjectRepository = userProjectRepository;
        this.userRepository = userRepository;
    }
    async createProject(projectCreateDto) {
        const project = this.projectRepository.create(projectCreateDto);
        const farm = await this.farmRepository.findOne({
            where: { id: projectCreateDto.farmId },
        });
        if (farm) {
            project.farm = farm;
        }
        else {
            throw new Error('Farm not found');
        }
        await this.projectRepository.save(project);
        return project;
    }
    async getProjects(pageOptionsDto) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.farm', 'farm');
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(project.name) LIKE :name', {
                name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        const allowedSortColumns = ['name'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'project', allowedSortColumns);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async getProjectsByFarmId(farmId) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.farm', 'farm')
            .where('farm.id = :farmId', {
            farmId,
        });
        const projects = await queryBuilder.getMany();
        return projects.map((project) => project.toDto());
    }
    async getProject(projectId) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.farm', 'farm');
        queryBuilder.where('project.id = :projectId', {
            projectId,
        });
        const projectEntity = await queryBuilder.getOne();
        if (!projectEntity) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        return projectEntity.toDto();
    }
    async getMembers(projectId) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .where('project.id = :projectId', {
            projectId,
        });
        const members = await queryBuilder.getMany();
        const result = [];
        for (const member of members) {
            for (const userProject of member.users) {
                result.push(new user_basic_response_dto_1.UserBasicDto(userProject.user));
            }
        }
        return result;
    }
    async deleteProject(id) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .where('project.id = :id', { id });
        const projectEntity = await queryBuilder.getOne();
        if (!projectEntity) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        await this.projectRepository.remove(projectEntity);
    }
    async updateProject(id, projectDto) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.farm', 'farm')
            .where('project.id = :id', { id });
        const projectEntity = await queryBuilder.getOne();
        if (!projectEntity) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        this.projectRepository.merge(projectEntity, projectDto);
        const farm = await this.farmRepository.findOne({
            where: { id: projectDto.farmId },
        });
        if (farm) {
            projectEntity.farm = farm;
        }
        else {
            throw new Error('Farm not found');
        }
        await this.projectRepository.save(projectEntity);
    }
    async addUsersToProject(id, userIds) {
        const uniqueUserIds = [...new Set(userIds)];
        const projectEntity = await this.projectRepository.findOne({
            where: { id },
            relations: ['users'],
        });
        if (!projectEntity) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        const users = await this.userRepository.findBy({
            id: (0, typeorm_2.In)(uniqueUserIds),
        });
        const foundUserIds = new Set(users.map((user) => user.id));
        const missingUserIds = uniqueUserIds.filter((userId) => !foundUserIds.has(userId));
        if (missingUserIds.length > 0) {
            throw new common_1.BadRequestException(`The following users do not exist: ${missingUserIds.join(', ')}`);
        }
        const existingUserIds = new Set(projectEntity.users.map((userProject) => userProject.userId));
        const newUsers = users.filter((user) => !existingUserIds.has(user.id));
        const newUserProjects = newUsers.map((user) => {
            const userProject = new user_project_entity_1.UserProjectEntity();
            userProject.userId = user.id;
            userProject.projectId = id;
            userProject.user = user;
            userProject.project = projectEntity;
            return userProject;
        });
        projectEntity.users = [...projectEntity.users, ...newUserProjects];
        await this.projectRepository.save(projectEntity);
        await this.userProjectRepository.save(newUserProjects);
    }
    async removeUsersFromProject(id, userIds) {
        const uniqueUserIds = [...new Set(userIds)];
        const projectEntity = await this.projectRepository.findOne({
            where: { id },
            relations: ['users'],
        });
        if (!projectEntity) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        const users = await this.userRepository.findBy({
            id: (0, typeorm_2.In)(uniqueUserIds),
        });
        const foundUserIds = new Set(users.map((user) => user.id));
        const missingUserIds = uniqueUserIds.filter((userId) => !foundUserIds.has(userId));
        if (missingUserIds.length > 0) {
            throw new common_1.BadRequestException(`The following users do not exist: ${missingUserIds.join(', ')}`);
        }
        const projectUsersIds = new Set(projectEntity.users.map((userProject) => userProject.userId));
        const usersNotInProject = uniqueUserIds.filter((userId) => !projectUsersIds.has(userId));
        if (usersNotInProject.length > 0) {
            throw new common_1.BadRequestException(`The following users are not part of the project: ${usersNotInProject.join(', ')}`);
        }
        projectEntity.users = projectEntity.users.filter((userProject) => !uniqueUserIds.includes(userProject.userId));
        await this.userProjectRepository.delete({
            userId: (0, typeorm_2.In)(uniqueUserIds),
            projectId: id,
        });
        await this.projectRepository.save(projectEntity);
    }
    async getUsersInProject(id) {
        const projectEntity = await this.projectRepository.findOne({
            where: { id },
            relations: ['users', 'users.user'],
        });
        if (!projectEntity) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        return projectEntity.users.map((user) => new user_basic_response_dto_1.UserBasicDto(user.user));
    }
};
exports.ProjectService = ProjectService;
tslib_1.__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [project_create_dto_1.ProjectCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ProjectService.prototype, "createProject", null);
exports.ProjectService = ProjectService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(farm_entity_1.FarmEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(user_project_entity_1.UserProjectEntity)),
    tslib_1.__param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectService);
//# sourceMappingURL=project.service.js.map