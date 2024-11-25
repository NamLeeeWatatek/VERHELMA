import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  VirtualColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { AccountStatus } from '../../constants/account-status';
import { UseDto } from '../../decorators';
import { RoleEntity } from '../role/role.entity';
import { TaskAssignmentEntity } from '../task-assignment/task-assignment.entity';
import { UserProjectEntity } from '../user-project/user-project.entity';
import { UserDto } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  static entityName = 'user';

  @Column({ unique: true, nullable: false })
  userName!: string;

  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  role!: RoleEntity | null;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.INACTIVE,
  })
  accountStatus!: AccountStatus;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  phoneNumber!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ nullable: true, type: 'date' })
  birthday!: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.subordinates, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  supervisor: UserEntity | null = null;

  @OneToMany(() => UserEntity, (user) => user.supervisor)
  subordinates!: UserEntity[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @Column({ nullable: true, type: 'timestamp' })
  lastLogin!: Date | null;

  @Column('text', { nullable: true })
  deviceToken?: string;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 6 })
  latitude!: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 6 })
  longitude!: number | null;

  @OneToMany(
    () => TaskAssignmentEntity,
    (taskAssignment) => taskAssignment.user,
  )
  taskAssignments!: TaskAssignmentEntity[];

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.user)
  projects!: UserProjectEntity[];
}
