import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ProjectStatus } from '../../../constants/project-status.enum';
import { FarmInfoDto } from '../../farm/dtos/farm-info.dto';
import type { ProjectEntity } from '../project.entity';

export class ProjectDto extends AbstractDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  farm?: FarmInfoDto;

  constructor(project: ProjectEntity) {
    super(project);
    this.name = project.name;
    this.description = project.description;
    this.status = project.status;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.farm = project.farm ? new FarmInfoDto(project.farm) : undefined;
  }
}
