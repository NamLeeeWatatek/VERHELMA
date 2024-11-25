/* eslint-disable max-params */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { ChangePasswordDto } from 'modules/auth/dto/change-password.dto';
import type { LocationDto } from 'shared/dtos/location.dto';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { PageDto } from '../../common/dto/page.dto';
import { applySorting, validateHash } from '../../common/utils';
import { FolderName } from '../../constants/folder-name';
import { Role } from '../../constants/role.enum';
import { FileNotImageException, UserNotFoundException } from '../../exceptions';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { CheckInEntity } from '../check-in/check-in.entity';
import { LocationHistoryService } from '../location-history/location-history.service';
import { RoleEntity } from '../role/role.entity';
import { FirebaseFirestoreService } from './../../shared/services/firebase-realtime-database.service';
import { CreateSettingsCommand } from './commands/create-settings.command';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import type { UserDto } from './dtos/user.dto';
import { UserBasicDto } from './dtos/user-basic.response.dto';
import type { UserFilterDto } from './dtos/user-filter.dto';
import { UserLocationTrackingDto } from './dtos/user-location-tracking.dto';
import type { UserUpdateDto } from './dtos/user-update.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserSettingsEntity } from './user-settings.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserSettingsEntity)
    private userSettingsRepository: Repository<UserSettingsEntity>,
    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,
    private validatorService: ValidatorService,
    private firebaseStorageService: FirebaseStorageService,
    private commandBus: CommandBus,
    private firebaseFirestoreService: FirebaseFirestoreService,
    private locationHistoryService: LocationHistoryService,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: findData,
      relations: ['role'],
    });
  }

  async findByEmailOrPhoneNumber(
    options: Partial<{ email: string; phoneNumber: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.phoneNumber) {
      queryBuilder.orWhere('user.phoneNumber = :phoneNumber', {
        phoneNumber: options.phoneNumber,
      });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const registeredEmail = await this.findByEmailOrPhoneNumber({
      email: userRegisterDto.email,
    });

    if (registeredEmail) {
      throw new BadRequestException(
        'Email is already registered. Please use a different email.',
      );
    }

    const registeredPhoneNumber = await this.findByEmailOrPhoneNumber({
      phoneNumber: userRegisterDto.phoneNumber,
    });

    if (registeredPhoneNumber) {
      throw new BadRequestException(
        'Phone number is already registered. Please use a different phone number.',
      );
    }

    const user = this.userRepository.create(userRegisterDto);
    user.userName = userRegisterDto.email;

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      const { fileUrl } = await this.firebaseStorageService.uploadFile(
        file,
        FolderName.Avatar,
      );

      user.avatar = fileUrl;
    }

    await this.userRepository.save(user);
    await this.firebaseFirestoreService.syncNewUserToFirebase(user); // error
    user.settings = await this.createSettings(
      user.id,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );

    return user;
  }

  async updatePassword(changePasswordDto: ChangePasswordDto): Promise<UserDto> {
    const { identifier, oldPassword, newPassword } = changePasswordDto;

    const registeredEmail = await this.findByEmailOrPhoneNumber({
      email: identifier,
    });

    const registeredPhoneNumber = await this.findByEmailOrPhoneNumber({
      phoneNumber: identifier,
    });

    if (!registeredEmail && !registeredPhoneNumber) {
      throw new BadRequestException('User is not exist!');
    }

    const user = registeredEmail ?? registeredPhoneNumber;

    if (user !== null) {
      const isOldPasswordValid = await validateHash(oldPassword, user.password);

      if (!isOldPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      user.password = newPassword;

      await this.userRepository.save(user);

      return user.toDto();
    }

    throw new BadRequestException('Errorrr!');
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
    userFilterDto: UserFilterDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.settings', 'settings')
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('users.supervisor', 'supervisor');

    if (pageOptionsDto.q) {
      queryBuilder.andWhere(
        `LOWER(CONCAT(users.firstName, ' ', users.lastName)) LIKE :query OR 
           LOWER(users.email) LIKE :query OR 
           LOWER(users.phoneNumber) LIKE :query`,
        {
          query: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
        },
      );
    }

    if (pageOptionsDto.orderBy) {
      if (pageOptionsDto.orderBy === 'fullName') {
        queryBuilder.orderBy(`users.firstName`, pageOptionsDto.order);
      } else {
        const allowedSortColumns = ['email'];
        applySorting(queryBuilder, pageOptionsDto, 'users', allowedSortColumns);
      }
    }

    if (userFilterDto.accountStatus) {
      queryBuilder.andWhere('users.accountStatus = :accountStatus', {
        accountStatus: userFilterDto.accountStatus,
      });
    }

    if (userFilterDto.role) {
      let roleValue: Role;

      if (
        Object.keys(Role).includes(
          userFilterDto.role.toLocaleUpperCase() as Role,
        )
      ) {
        roleValue = Role[userFilterDto.role as keyof typeof Role];
      } else {
        throw new BadRequestException('Invalid Role!');
      }

      queryBuilder.andWhere('role.name = :role', { role: roleValue });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    if (items.length === 0) {
      return new PageDto<UserDto>([], pageMetaDto);
    }

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.supervisor', 'supervisor')
      .where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async createSettings(
    userId: Uuid,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }

  async updateSettings(
    userId: Uuid,
    updateSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    const existingSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    });

    if (!existingSettings) {
      throw new NotFoundException('Settings not found!');
    }

    this.userSettingsRepository.merge(existingSettings, updateSettingsDto);

    return this.userSettingsRepository.save(existingSettings);
  }

  async updateUser(
    id: Uuid,
    updateData: Partial<UserUpdateDto>,
    file?: Express.Multer.File,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    const isEmailChanged = updateData.email !== user.email;
    const isPhoneNumberChanged = updateData.phoneNumber !== user.phoneNumber;

    this.userRepository.merge(user, updateData);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      const { fileUrl } = await this.firebaseStorageService.uploadFile(
        file,
        FolderName.Avatar,
      );

      user.avatar = fileUrl;
    }

    if (isEmailChanged) {
      user.settings = await this.updateSettings(
        user.id,
        plainToClass(CreateSettingsDto, {
          isEmailVerified: false,
        }),
      );
    }

    if (isPhoneNumberChanged) {
      user.settings = await this.updateSettings(
        user.id,
        plainToClass(CreateSettingsDto, {
          isPhoneVerified: false,
        }),
      );
    }

    await this.userRepository.save(user);

    return user;
  }

  async deleteUser(userId: Uuid): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async updateLastLogin(userId: Uuid): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UserNotFoundException();
    }

    user.lastLogin = new Date();
    await this.userRepository.save(user);
  }

  async updateDeviceToken(userId: Uuid, token: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UserNotFoundException();
    }

    user.deviceToken = token;
    await this.userRepository.save(user);
  }

  async removeRoleFromUser(userId: Uuid): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    user.role = null;

    await this.userRepository.save(user);
  }

  async assignRoleToUser(userId: Uuid, roleId: Uuid): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UserNotFoundException();
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new Error('Role not found');
    }

    user.role = role;
    await this.userRepository.save(user);

    return user;
  }

  async getLastSeenLocation(userId: Uuid): Promise<UserLocationTrackingDto> {
    const queryBuilder = this.checkInRepository.createQueryBuilder('checkIn');

    const lastLocation = await queryBuilder
      .where('checkIn.userId = :userId', { userId })
      .orderBy('GREATEST(checkIn.checkInTime, checkIn.checkOutTime)', 'DESC')
      .getOne();

    if (!lastLocation) {
      throw new NotFoundException('Not found any check in records!!!');
    }

    const trackingResult = new UserLocationTrackingDto();

    trackingResult.location.latitude =
      lastLocation.checkOutLatitude ?? lastLocation.checkInLatitude;
    trackingResult.location.longitude =
      lastLocation.checkOutLongitude ?? lastLocation.checkInLongitude;

    trackingResult.lastSeen =
      lastLocation.checkOutTime ?? lastLocation.checkInTime;

    return trackingResult;
  }

  async updateLocation(user: UserEntity, location: LocationDto) {
    user.latitude = location.latitude;
    user.longitude = location.longitude;

    try {
      await this.locationHistoryService.create(user, location);
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user location:', error);

      throw new InternalServerErrorException('Could not update location.');
    }
  }

  async setSupervisor(userId: Uuid, supervisorId: Uuid) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UserNotFoundException();
    }

    const supervisor = await this.userRepository.findOne({
      where: {
        id: supervisorId,
        role: { name: Role.SUPERVISOR },
      },
      relations: ['role'],
    });

    if (!supervisor) {
      throw new NotFoundException('Supervisor not found!');
    }

    user.supervisor = supervisor;

    await this.userRepository.save(user);
  }

  async getSubordinates(userId: Uuid): Promise<UserBasicDto[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.subordinates', 'subordinate')
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.subordinates.length > 0) {
      return user.subordinates.map(
        (subordinate) => new UserBasicDto(subordinate),
      );
    }

    return [];
  }
}
