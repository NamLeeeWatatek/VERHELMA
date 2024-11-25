"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_dto_1 = require("../../common/dto/page.dto");
const utils_1 = require("../../common/utils");
const role_permission_entity_1 = require("../../modules/role-permission/role-permission.entity");
const permission_entity_1 = require("../permission/permission.entity");
const role_dto_1 = require("./dtos/role.dto");
const role_entity_1 = require("./role.entity");
let RoleService = class RoleService {
    roleRepository;
    rolePermissionRepository;
    permissionRepository;
    constructor(roleRepository, rolePermissionRepository, permissionRepository) {
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
    }
    async createRole(roleCreateDto) {
        const role = this.roleRepository.create(roleCreateDto);
        await this.roleRepository.save(role);
        if (roleCreateDto.permissionIds && roleCreateDto.permissionIds.length > 0) {
            const permissions = await this.permissionRepository.find({
                where: { id: (0, typeorm_2.In)(roleCreateDto.permissionIds) },
            });
            const foundPermissionIds = new Set(permissions.map((permission) => permission.id));
            const missingPermissionIds = roleCreateDto.permissionIds.filter((id) => !foundPermissionIds.has(id));
            if (missingPermissionIds.length > 0) {
                throw new common_1.NotFoundException(`Permissions not found for IDs: ${missingPermissionIds.join(', ')}`);
            }
            const rolePermissions = permissions.map((permission) => ({
                roleId: role.id,
                permissionId: permission.id,
                role,
                permission,
            }));
            role.rolePermissions = rolePermissions;
            await this.rolePermissionRepository.save(rolePermissions);
        }
        return role;
    }
    async getRoles(pageOptionsDto) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission');
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(role.name) LIKE :name', {
                name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        const allowedSortColumns = ['name'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'role', allowedSortColumns);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const roleDtos = items.map((role) => new role_dto_1.RoleDto(role));
        return new page_dto_1.PageDto(roleDtos, pageMetaDto);
    }
    async getRole(roleId) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission')
            .where('role.id = :roleId', { roleId });
        const role = await queryBuilder.getOne();
        if (!role) {
            throw new common_1.NotFoundException(`Role not found for ID: ${roleId}`);
        }
        return new role_dto_1.RoleDto(role);
    }
    async getPermissions(roleId) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission')
            .where('role.id = :roleId', { roleId });
        const role = await queryBuilder.getOne();
        return (role?.rolePermissions?.map((rp) => rp.permission.permissionName) ?? []);
    }
    async getPermissionsByRoleId(roleId) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission')
            .where('role.id = :roleId', { roleId });
        const role = await queryBuilder.getOne();
        if (!role) {
            throw new common_1.NotFoundException(`Role not found for ID: ${roleId}`);
        }
        return (role.rolePermissions?.map((rp) => rp.permission.permissionName) ?? []);
    }
    async updateRole(roleId, roleUpdateDto) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .where('role.id = :roleId', { roleId });
        const roleEntity = await queryBuilder.getOne();
        if (!roleEntity) {
            throw new common_1.NotFoundException('Role not found');
        }
        Object.assign(roleEntity, roleUpdateDto);
        await this.roleRepository.save(roleEntity);
        if (roleUpdateDto.permissionIds && roleUpdateDto.permissionIds.length > 0) {
            const permissions = await this.permissionRepository.find({
                where: { id: (0, typeorm_2.In)(roleUpdateDto.permissionIds) },
            });
            const foundPermissionIds = new Set(permissions.map((permission) => permission.id));
            const missingPermissionIds = roleUpdateDto.permissionIds.filter((id) => !foundPermissionIds.has(id));
            if (missingPermissionIds.length > 0) {
                throw new common_1.NotFoundException(`Permissions not found for IDs: ${missingPermissionIds.join(', ')}`);
            }
            await this.rolePermissionRepository.delete({ roleId: roleEntity.id });
            const rolePermissions = permissions.map((permission) => ({
                roleId: roleEntity.id,
                permissionId: permission.id,
            }));
            await this.rolePermissionRepository.save(rolePermissions);
        }
    }
    async deleteRole(roleId) {
        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .where('role.id = :id', { id: roleId });
        const roleEntity = await queryBuilder.getOne();
        if (!roleEntity) {
            throw new common_1.NotFoundException(`Role not found for ID: ${roleId}`);
        }
        await this.roleRepository.remove(roleEntity);
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map