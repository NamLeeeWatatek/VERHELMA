import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ProjectEntity } from '../project/project.entity';
import { UserEntity } from '../user/user.entity';

@Entity('user_projects')
export class UserProjectEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId!: Uuid;

  @PrimaryColumn({ name: 'project_id' })
  projectId!: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project!: ProjectEntity;
}
