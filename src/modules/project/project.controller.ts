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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { UserBasicDto } from 'modules/user/dtos/user-basic.response.dto';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageResponse, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { ProjectDto } from './dtos/project.dto';
import { AddUsersDto } from './dtos/project.request.dto';
import { ProjectCreateDto } from './dtos/project-create.dto';
import { ProjectService } from './project.service';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Create new project', type: ProjectDto })
  async createProject(@Body() projectCreateDto: ProjectCreateDto) {
    const permissionEntity =
      await this.projectService.createProject(projectCreateDto);

    return permissionEntity.toDto();
  }

  @Get()
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiPageResponse({
    description: 'Get projects list',
    type: PageDto,
  })
  getProjects(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProjectDto>> {
    return this.projectService.getProjects(pageOptionsDto);
  }

  @Get('/all/:farmId')
  @HttpCode(HttpStatus.OK)
  getProjectsByFarmId(
    @UUIDParam('farmId') farmId: Uuid,
  ): Promise<ProjectDto[]> {
    return this.projectService.getProjectsByFarmId(farmId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard({ public: false }))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project by id',
    type: ProjectDto,
  })
  getProject(@UUIDParam('id') projectId: Uuid): Promise<ProjectDto> {
    return this.projectService.getProject(projectId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project updated successfully!',
  })
  updateProject(
    @UUIDParam('id') id: Uuid,
    @Body() projectUpdateDto: ProjectCreateDto,
  ): Promise<void> {
    return this.projectService.updateProject(id, projectUpdateDto);
  }

  @Put('add-users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project updated successfully!',
  })
  addUsers(@UUIDParam('id') id: Uuid, @Body() dto: AddUsersDto): Promise<void> {
    return this.projectService.addUsersToProject(id, dto.userIds);
  }

  @Put('remove-users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project updated successfully!',
  })
  removeUsers(
    @UUIDParam('id') id: Uuid,
    @Body() dto: AddUsersDto,
  ): Promise<void> {
    return this.projectService.removeUsersFromProject(id, dto.userIds);
  }

  @Get('members/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project member by project id',
    type: ProjectDto,
  })
  getMembers(@UUIDParam('id') projectId: Uuid): Promise<UserBasicDto[]> {
    return this.projectService.getMembers(projectId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Project deleted successfully!',
  })
  async deleteProject(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.projectService.deleteProject(id);
  }
}
