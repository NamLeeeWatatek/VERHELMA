"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const utils_1 = require("../../common/utils");
const action_enum_1 = require("../../constants/action.enum");
const permission_create_dto_1 = require("./dtos/permission-create.dto");
const permission_not_found_exception_1 = require("./exceptions/permission-not-found.exception");
const permission_entity_1 = require("./permission.entity");
let PermissionService = class PermissionService {
    permissionRepository;
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async createPermission(permissionCreateDto) {
        const permission = this.permissionRepository.create(permissionCreateDto);
        await this.permissionRepository.save(permission);
        return permission;
    }
    async getPermissions(pageOptionsDto) {
        const queryBuilder = this.permissionRepository.createQueryBuilder('permission');
        const allowedSortColumns = ['permissionName'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'permission', allowedSortColumns);
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(permission.permissionName) LIKE :permissionName', {
                permissionName: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async getPermission(permissionId) {
        const queryBuilder = this.permissionRepository.createQueryBuilder('permission');
        queryBuilder.where('permission.id = :permissionId', {
            permissionId,
        });
        const permissionEntity = await queryBuilder.getOne();
        if (!permissionEntity) {
            throw new permission_not_found_exception_1.PermissionNotFoundException();
        }
        return permissionEntity.toDto();
    }
    async deletePermission(id) {
        const queryBuilder = this.permissionRepository
            .createQueryBuilder('permission')
            .where('permission.id = :id', { id });
        const permissionEntity = await queryBuilder.getOne();
        if (!permissionEntity) {
            throw new permission_not_found_exception_1.PermissionNotFoundException();
        }
        await this.permissionRepository.remove(permissionEntity);
    }
    async updatePermission(id, permissionDto) {
        const queryBuilder = this.permissionRepository
            .createQueryBuilder('permission')
            .where('permission.id = :id', { id });
        const permissionEntity = await queryBuilder.getOne();
        if (!permissionEntity) {
            throw new permission_not_found_exception_1.PermissionNotFoundException();
        }
        this.permissionRepository.merge(permissionEntity, permissionDto);
        await this.permissionRepository.save(permissionEntity);
    }
    async generatePermissions() {
        const queryBuilder = this.permissionRepository.createQueryBuilder('permission');
        const permissions = await queryBuilder.getMany();
        const existingPermissionNames = new Set(permissions.map((p) => p.permissionName));
        const modules = [
            'area',
            'permission',
            'document',
            'document-category',
            'project',
            'role',
            'user',
        ];
        const newPermissions = [];
        for (const module of modules) {
            for (const action of Object.values(action_enum_1.Action)) {
                const newPermissionName = `${module}:${action}`;
                if (!existingPermissionNames.has(newPermissionName)) {
                    const permission = this.permissionRepository.create({
                        permissionName: newPermissionName,
                    });
                    newPermissions.push(permission);
                }
            }
        }
        if (newPermissions.length > 0) {
            await this.permissionRepository.save(newPermissions);
        }
    }
};
exports.PermissionService = PermissionService;
tslib_1.__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [permission_create_dto_1.PermissionCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PermissionService.prototype, "createPermission", null);
exports.PermissionService = PermissionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionService);
//# sourceMappingURL=permission.service.js.map