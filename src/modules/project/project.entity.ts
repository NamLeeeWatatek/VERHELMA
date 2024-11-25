import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ProjectStatus } from '../../constants/project-status.enum';
import { UseDto } from '../../decorators';
import { FarmEntity } from '../farm/farm.entity';
import { UserEntity } from '../user/user.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import { ProjectDto } from './dtos/project.dto';

@Entity('projects')
@UseDto(ProjectDto)
export class ProjectEntity extends AbstractEntity<ProjectDto> {
  static entityName = 'project';

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy!: UserEntity;

  @ManyToOne(() => FarmEntity)
  farm!: FarmEntity;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.NOT_STARTED,
  })
  status?: ProjectStatus;

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.project)
  users!: UserProjectEntity[];
}
