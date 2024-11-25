import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity('clock_ins')
export class ClockInEntity {
  static entityName = 'clock-in';

  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  user!: UserEntity;

  @Column('text', { array: true, nullable: true })
  clockInImageUrls?: string[];

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  clockInLatitude!: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  clockInLongitude!: number;

  @Column('text', { array: true, nullable: true })
  clockOutImageUrls?: string[];

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  clockOutLatitude?: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  clockOutLongitude?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  clockInTime!: Date;

  @Column('timestamp', { nullable: true })
  clockOutTime!: Date | null;
}
