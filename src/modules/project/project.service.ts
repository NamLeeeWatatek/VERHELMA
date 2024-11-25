import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from 'common/dto/page.dto';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { applySorting } from '../../common/utils';
import { FarmEntity } from '../farm/farm.entity';
import { UserBasicDto } from '../user/dtos/user-basic.response.dto';
import { UserEntity } from '../user/user.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import type { ProjectDto } from './dtos/project.dto';
import { ProjectCreateDto } from './dtos/project-create.dto';
import { ProjectNotFoundException } from './exceptions/project-not-found.exception';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(FarmEntity)
    private farmRepository: Repository<FarmEntity>,
    @InjectRepository(UserProjectEntity)
    private userProjectRepository: Repository<UserProjectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Transactional()
  async createProject(
    projectCreateDto: ProjectCreateDto,
  ): Promise<ProjectEntity> {
    const project = this.projectRepository.create(projectCreateDto);

    const farm = await this.farmRepository.findOne({
      where: { id: projectCreateDto.farmId },
    });

    if (farm) {
      project.farm = farm;
    } else {
      throw new Error('Farm not found');
    }

    await this.projectRepository.save(project);

    return project;
  }

  async getProjects(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProjectDto>> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.farm', 'farm');

    if (pageOptionsDto.q) {
      queryBuilder.andWhere('LOWER(project.name) LIKE :name', {
        name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
      });
    }

    const allowedSortColumns = ['name'];

    applySorting(queryBuilder, pageOptionsDto, 'project', allowedSortColumns);

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getProjectsByFarmId(farmId: Uuid): Promise<ProjectDto[]> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.farm', 'farm')
      .where('farm.id = :farmId', {
        farmId,
      });

    const projects = await queryBuilder.getMany();

    return projects.map((project) => project.toDto());
  }

  async getProject(projectId: Uuid): Promise<ProjectDto> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.farm', 'farm');

    queryBuilder.where('project.id = :projectId', {
      projectId,
    });

    const projectEntity = await queryBuilder.getOne();

    if (!projectEntity) {
      throw new ProjectNotFoundException();
    }

    return projectEntity.toDto();
  }

  async getMembers(projectId: Uuid): Promise<UserBasicDto[]> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.users', 'users')
      .leftJoinAndSelect('users.user', 'user')
      .where('project.id = :projectId', {
        projectId,
      });

    const members = await queryBuilder.getMany();

    const result: UserBasicDto[] = [];

    for (const member of members) {
      for (const userProject of member.users) {
        result.push(new UserBasicDto(userProject.user));
      }
    }

    return result;
  }

  async deleteProject(id: Uuid): Promise<void> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id });

    const projectEntity = await queryBuilder.getOne();

    if (!projectEntity) {
      throw new ProjectNotFoundException();
    }

    await this.projectRepository.remove(projectEntity);
  }

  async updateProject(id: Uuid, projectDto: ProjectCreateDto): Promise<void> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.farm', 'farm')
      .where('project.id = :id', { id });

    const projectEntity = await queryBuilder.getOne();

    if (!projectEntity) {
      throw new ProjectNotFoundException();
    }

    this.projectRepository.merge(projectEntity, projectDto);

    const farm = await this.farmRepository.findOne({
      where: { id: projectDto.farmId },
    });

    if (farm) {
      projectEntity.farm = farm;
    } else {
      throw new Error('Farm not found');
    }

    await this.projectRepository.save(projectEntity);
  }

  async addUsersToProject(id: Uuid, userIds: Uuid[]): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)];

    const projectEntity = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!projectEntity) {
      throw new ProjectNotFoundException();
    }

    const users = await this.userRepository.findBy({
      id: In(uniqueUserIds),
    });

    const foundUserIds = new Set(users.map((user) => user.id));
    const missingUserIds = uniqueUserIds.filter(
      (userId) => !foundUserIds.has(userId),
    );

    if (missingUserIds.length > 0) {
      throw new BadRequestException(
        `The following users do not exist: ${missingUserIds.join(', ')}`,
      );
    }

    const existingUserIds = new Set(
      projectEntity.users.map((userProject) => userProject.userId),
    );
    const newUsers = users.filter((user) => !existingUserIds.has(user.id));

    const newUserProjects = newUsers.map((user) => {
      const userProject = new UserProjectEntity();
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

  async removeUsersFromProject(id: Uuid, userIds: Uuid[]): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)];

    const projectEntity = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!projectEntity) {
      throw new ProjectNotFoundException();
    }

    const users = await this.userRepository.findBy({
      id: In(uniqueUserIds),
    });

    const foundUserIds = new Set(users.map((user) => user.id));
    const missingUserIds = uniqueUserIds.filter(
      (userId) => !foundUserIds.has(userId),
    );

    if (missingUserIds.length > 0) {
      throw new BadRequestException(
        `The following users do not exist: ${missingUserIds.join(', ')}`,
      );
    }

    const projectUsersIds = new Set(
      projectEntity.users.map((userProject) => userProject.userId),
    );

    // Find any users requested for removal that do not belong to the project
    const usersNotInProject = uniqueUserIds.filter(
      (userId) => !projectUsersIds.has(userId),
    );

    if (usersNotInProject.length > 0) {
      throw new BadRequestException(
        `The following users are not part of the project: ${usersNotInProject.join(', ')}`,
      );
    }

    projectEntity.users = projectEntity.users.filter(
      (userProject) => !uniqueUserIds.includes(userProject.userId),
    );

    await this.userProjectRepository.delete({
      userId: In(uniqueUserIds),
      projectId: id,
    });

    await this.projectRepository.save(projectEntity);
  }

  async getUsersInProject(id: Uuid): Promise<UserBasicDto[]> {
    const projectEntity = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'users.user'],
    });

    if (!projectEntity) {
      throw new ProjectNotFoundException();
    }

    return projectEntity.users.map((user) => new UserBasicDto(user.user));
  }
}
