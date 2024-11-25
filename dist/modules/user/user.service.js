"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const page_dto_1 = require("../../common/dto/page.dto");
const utils_1 = require("../../common/utils");
const folder_name_1 = require("../../constants/folder-name");
const role_enum_1 = require("../../constants/role.enum");
const exceptions_1 = require("../../exceptions");
const firebase_storage_service_1 = require("../../shared/services/firebase-storage.service");
const validator_service_1 = require("../../shared/services/validator.service");
const user_register_dto_1 = require("../auth/dto/user-register.dto");
const check_in_entity_1 = require("../check-in/check-in.entity");
const location_history_service_1 = require("../location-history/location-history.service");
const role_entity_1 = require("../role/role.entity");
const firebase_realtime_database_service_1 = require("./../../shared/services/firebase-realtime-database.service");
const create_settings_command_1 = require("./commands/create-settings.command");
const create_settings_dto_1 = require("./dtos/create-settings.dto");
const user_basic_response_dto_1 = require("./dtos/user-basic.response.dto");
const user_location_tracking_dto_1 = require("./dtos/user-location-tracking.dto");
const user_entity_1 = require("./user.entity");
const user_settings_entity_1 = require("./user-settings.entity");
let UserService = class UserService {
    userRepository;
    roleRepository;
    userSettingsRepository;
    checkInRepository;
    validatorService;
    firebaseStorageService;
    commandBus;
    firebaseFirestoreService;
    locationHistoryService;
    constructor(userRepository, roleRepository, userSettingsRepository, checkInRepository, validatorService, firebaseStorageService, commandBus, firebaseFirestoreService, locationHistoryService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.checkInRepository = checkInRepository;
        this.validatorService = validatorService;
        this.firebaseStorageService = firebaseStorageService;
        this.commandBus = commandBus;
        this.firebaseFirestoreService = firebaseFirestoreService;
        this.locationHistoryService = locationHistoryService;
    }
    findOne(findData) {
        return this.userRepository.findOne({
            where: findData,
            relations: ['role'],
        });
    }
    async findByEmailOrPhoneNumber(options) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.settings', 'settings');
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
    async createUser(userRegisterDto, file) {
        const registeredEmail = await this.findByEmailOrPhoneNumber({
            email: userRegisterDto.email,
        });
        if (registeredEmail) {
            throw new common_1.BadRequestException('Email is already registered. Please use a different email.');
        }
        const registeredPhoneNumber = await this.findByEmailOrPhoneNumber({
            phoneNumber: userRegisterDto.phoneNumber,
        });
        if (registeredPhoneNumber) {
            throw new common_1.BadRequestException('Phone number is already registered. Please use a different phone number.');
        }
        const user = this.userRepository.create(userRegisterDto);
        user.userName = userRegisterDto.email;
        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new exceptions_1.FileNotImageException();
        }
        if (file) {
            const { fileUrl } = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.Avatar);
            user.avatar = fileUrl;
        }
        await this.userRepository.save(user);
        await this.firebaseFirestoreService.syncNewUserToFirebase(user);
        user.settings = await this.createSettings(user.id, (0, class_transformer_1.plainToClass)(create_settings_dto_1.CreateSettingsDto, {
            isEmailVerified: false,
            isPhoneVerified: false,
        }));
        return user;
    }
    async updatePassword(changePasswordDto) {
        const { identifier, oldPassword, newPassword } = changePasswordDto;
        const registeredEmail = await this.findByEmailOrPhoneNumber({
            email: identifier,
        });
        const registeredPhoneNumber = await this.findByEmailOrPhoneNumber({
            phoneNumber: identifier,
        });
        if (!registeredEmail && !registeredPhoneNumber) {
            throw new common_1.BadRequestException('User is not exist!');
        }
        const user = registeredEmail ?? registeredPhoneNumber;
        if (user !== null) {
            const isOldPasswordValid = await (0, utils_1.validateHash)(oldPassword, user.password);
            if (!isOldPasswordValid) {
                throw new common_1.BadRequestException('Current password is incorrect');
            }
            user.password = newPassword;
            await this.userRepository.save(user);
            return user.toDto();
        }
        throw new common_1.BadRequestException('Errorrr!');
    }
    async getUsers(pageOptionsDto, userFilterDto) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.settings', 'settings')
            .leftJoinAndSelect('users.role', 'role')
            .leftJoinAndSelect('users.supervisor', 'supervisor');
        if (pageOptionsDto.q) {
            queryBuilder.andWhere(`LOWER(CONCAT(users.firstName, ' ', users.lastName)) LIKE :query OR 
           LOWER(users.email) LIKE :query OR 
           LOWER(users.phoneNumber) LIKE :query`, {
                query: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        if (pageOptionsDto.orderBy) {
            if (pageOptionsDto.orderBy === 'fullName') {
                queryBuilder.orderBy(`users.firstName`, pageOptionsDto.order);
            }
            else {
                const allowedSortColumns = ['email'];
                (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'users', allowedSortColumns);
            }
        }
        if (userFilterDto.accountStatus) {
            queryBuilder.andWhere('users.accountStatus = :accountStatus', {
                accountStatus: userFilterDto.accountStatus,
            });
        }
        if (userFilterDto.role) {
            let roleValue;
            if (Object.keys(role_enum_1.Role).includes(userFilterDto.role.toLocaleUpperCase())) {
                roleValue = role_enum_1.Role[userFilterDto.role];
            }
            else {
                throw new common_1.BadRequestException('Invalid Role!');
            }
            queryBuilder.andWhere('role.name = :role', { role: roleValue });
        }
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        if (items.length === 0) {
            return new page_dto_1.PageDto([], pageMetaDto);
        }
        return items.toPageDto(pageMetaDto);
    }
    async getUser(userId) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.supervisor', 'supervisor')
            .where('user.id = :userId', { userId });
        const userEntity = await queryBuilder.getOne();
        if (!userEntity) {
            throw new exceptions_1.UserNotFoundException();
        }
        return userEntity.toDto();
    }
    async createSettings(userId, createSettingsDto) {
        return this.commandBus.execute(new create_settings_command_1.CreateSettingsCommand(userId, createSettingsDto));
    }
    async updateSettings(userId, updateSettingsDto) {
        const existingSettings = await this.userSettingsRepository.findOne({
            where: { userId },
        });
        if (!existingSettings) {
            throw new common_1.NotFoundException('Settings not found!');
        }
        this.userSettingsRepository.merge(existingSettings, updateSettingsDto);
        return this.userSettingsRepository.save(existingSettings);
    }
    async updateUser(id, updateData, file) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id });
        const user = await queryBuilder.getOne();
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        const isEmailChanged = updateData.email !== user.email;
        const isPhoneNumberChanged = updateData.phoneNumber !== user.phoneNumber;
        this.userRepository.merge(user, updateData);
        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new exceptions_1.FileNotImageException();
        }
        if (file) {
            const { fileUrl } = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.Avatar);
            user.avatar = fileUrl;
        }
        if (isEmailChanged) {
            user.settings = await this.updateSettings(user.id, (0, class_transformer_1.plainToClass)(create_settings_dto_1.CreateSettingsDto, {
                isEmailVerified: false,
            }));
        }
        if (isPhoneNumberChanged) {
            user.settings = await this.updateSettings(user.id, (0, class_transformer_1.plainToClass)(create_settings_dto_1.CreateSettingsDto, {
                isPhoneVerified: false,
            }));
        }
        await this.userRepository.save(user);
        return user;
    }
    async deleteUser(userId) {
        await this.userRepository.delete(userId);
    }
    async updateLastLogin(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        user.lastLogin = new Date();
        await this.userRepository.save(user);
    }
    async updateDeviceToken(userId, token) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        user.deviceToken = token;
        await this.userRepository.save(user);
    }
    async removeRoleFromUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        user.role = null;
        await this.userRepository.save(user);
    }
    async assignRoleToUser(userId, roleId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
            throw new Error('Role not found');
        }
        user.role = role;
        await this.userRepository.save(user);
        return user;
    }
    async getLastSeenLocation(userId) {
        const queryBuilder = this.checkInRepository.createQueryBuilder('checkIn');
        const lastLocation = await queryBuilder
            .where('checkIn.userId = :userId', { userId })
            .orderBy('GREATEST(checkIn.checkInTime, checkIn.checkOutTime)', 'DESC')
            .getOne();
        if (!lastLocation) {
            throw new common_1.NotFoundException('Not found any check in records!!!');
        }
        const trackingResult = new user_location_tracking_dto_1.UserLocationTrackingDto();
        trackingResult.location.latitude =
            lastLocation.checkOutLatitude ?? lastLocation.checkInLatitude;
        trackingResult.location.longitude =
            lastLocation.checkOutLongitude ?? lastLocation.checkInLongitude;
        trackingResult.lastSeen =
            lastLocation.checkOutTime ?? lastLocation.checkInTime;
        return trackingResult;
    }
    async updateLocation(user, location) {
        user.latitude = location.latitude;
        user.longitude = location.longitude;
        try {
            await this.locationHistoryService.create(user, location);
            await this.userRepository.save(user);
        }
        catch (error) {
            console.error('Error updating user location:', error);
            throw new common_1.InternalServerErrorException('Could not update location.');
        }
    }
    async setSupervisor(userId, supervisorId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        const supervisor = await this.userRepository.findOne({
            where: {
                id: supervisorId,
                role: { name: role_enum_1.Role.SUPERVISOR },
            },
            relations: ['role'],
        });
        if (!supervisor) {
            throw new common_1.NotFoundException('Supervisor not found!');
        }
        user.supervisor = supervisor;
        await this.userRepository.save(user);
    }
    async getSubordinates(userId) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :userId', { userId })
            .leftJoinAndSelect('user.subordinates', 'subordinate')
            .getOne();
        if (!user) {
            throw new exceptions_1.UserNotFoundException();
        }
        if (user.subordinates.length > 0) {
            return user.subordinates.map((subordinate) => new user_basic_response_dto_1.UserBasicDto(subordinate));
        }
        return [];
    }
};
exports.UserService = UserService;
tslib_1.__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_register_dto_1.UserRegisterDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserService.prototype, "createUser", null);
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(user_settings_entity_1.UserSettingsEntity)),
    tslib_1.__param(3, (0, typeorm_1.InjectRepository)(check_in_entity_1.CheckInEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        validator_service_1.ValidatorService,
        firebase_storage_service_1.FirebaseStorageService,
        cqrs_1.CommandBus,
        firebase_realtime_database_service_1.FirebaseFirestoreService,
        location_history_service_1.LocationHistoryService])
], UserService);
//# sourceMappingURL=user.service.js.map