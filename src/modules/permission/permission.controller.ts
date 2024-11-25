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
  SetMetadata,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageResponse, UUIDParam } from '../../decorators';
import { PermissionDto } from './dtos/permission.dto';
import { PermissionCreateDto } from './dtos/permission-create.dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
@ApiTags('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiCreatedResponse({ type: PermissionDto })
  @ApiBody({
    type: PermissionCreateDto,
    description: 'Details of the permission to be created',
  })
  async createPermission(@Body() permissionCreateDto: PermissionCreateDto) {
    const permissionEntity =
      await this.permissionService.createPermission(permissionCreateDto);

    return permissionEntity.toDto();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of permissions' })
  @ApiPageResponse({
    description: 'Get permissions list',
    type: PageDto,
  })
  getPermissions(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PermissionDto>> {
    return this.permissionService.getPermissions(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific permission by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the permission to retrieve' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get permission',
    type: PermissionDto,
  })
  getPermission(@UUIDParam('id') permissionId: Uuid): Promise<PermissionDto> {
    return this.permissionService.getPermission(permissionId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing permission' })
  @ApiParam({ name: 'id', description: 'UUID of the permission to update' })
  @ApiBody({
    type: PermissionCreateDto,
    description: 'Updated permission data',
  })
  @ApiOkResponse({ description: 'Permission updated successfully' })
  updatePermission(
    @UUIDParam('id') id: Uuid,
    @Body() permissionUpdateDto: PermissionCreateDto,
  ): Promise<void> {
    return this.permissionService.updatePermission(id, permissionUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific permission' })
  @ApiParam({ name: 'id', description: 'UUID of the permission to delete' })
  @ApiNoContentResponse({ description: 'Permission deleted successfully' })
  async deletePermission(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.permissionService.deletePermission(id);
  }

  @Post('generate-permissions')
  @SetMetadata('skipAuth', true)
  async generatePermissions() {
    await this.permissionService.generatePermissions();
  }
}
