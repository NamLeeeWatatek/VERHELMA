import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageResponse, UUIDParam } from '../../decorators';
import { RoleDto } from './dtos/role.dto';
import { RoleCreateDto } from './dtos/role-create.dto';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Create new role', type: RoleDto })
  async createRole(@Body() roleCreateDto: RoleCreateDto) {
    const roleEntity = await this.roleService.createRole(roleCreateDto);

    return roleEntity.toDto();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageResponse({
    description: 'Get roles list',
    type: PageDto,
  })
  getRoles(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoleDto>> {
    return this.roleService.getRoles(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get role',
    type: RoleDto,
  })
  getRole(@UUIDParam('id') id: Uuid): Promise<RoleDto> {
    return this.roleService.getRole(id);
  }

  @Get('/permissions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get permission by role id',
  })
  getPermissionsByRoleId(@UUIDParam('id') id: Uuid): Promise<string[]> {
    return this.roleService.getPermissions(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role updated successfully!' })
  updateRole(
    @UUIDParam('id') id: Uuid,
    @Body() roleUpdateDto: RoleCreateDto,
  ): Promise<void> {
    return this.roleService.updateRole(id, roleUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Role deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  async deleteRole(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.roleService.deleteRole(id);
  }
}
