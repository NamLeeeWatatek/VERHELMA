/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { RoleService } from '../modules/role/role.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canSkipAuth = this.reflector.get<boolean>(
      'skipAuth',
      context.getHandler(),
    );

    if (canSkipAuth) {
      return true;
    }

    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const decodedToken = this.jwtService.decode(token);

    if (!decodedToken?.role) {
      throw new UnauthorizedException('Invalid token');
    }

    const userRole = decodedToken.role;

    const userPermissions = await this.roleService.getPermissionsByRoleId(
      userRole.id,
    );

    return userPermissions.includes(requiredPermission);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
