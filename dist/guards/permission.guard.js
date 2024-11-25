"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const role_service_1 = require("../modules/role/role.service");
let PermissionGuard = class PermissionGuard {
    reflector;
    jwtService;
    roleService;
    constructor(reflector, jwtService, roleService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
        this.roleService = roleService;
    }
    async canActivate(context) {
        const canSkipAuth = this.reflector.get('skipAuth', context.getHandler());
        if (canSkipAuth) {
            return true;
        }
        const requiredPermission = this.reflector.get('permission', context.getHandler());
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token found');
        }
        const decodedToken = this.jwtService.decode(token);
        if (!decodedToken?.role) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const userRole = decodedToken.role;
        const userPermissions = await this.roleService.getPermissionsByRoleId(userRole.id);
        return userPermissions.includes(requiredPermission);
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        role_service_1.RoleService])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map