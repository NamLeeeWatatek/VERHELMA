"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const typeorm_2 = require("typeorm");
const page_dto_1 = require("../../common/dto/page.dto");
const folder_name_1 = require("../../constants/folder-name");
const firebase_storage_service_1 = require("../../shared/services/firebase-storage.service");
const validator_service_1 = require("../../shared/services/validator.service");
const task_entity_1 = require("../task/task.entity");
const clock_in_entity_1 = require("./clock-in.entity");
const clock_in_dto_1 = require("./dtos/clock-in.dto");
let ClockInService = class ClockInService {
    clockInRepository;
    taskRepository;
    firebaseStorageService;
    validatorService;
    constructor(clockInRepository, taskRepository, firebaseStorageService, validatorService) {
        this.clockInRepository = clockInRepository;
        this.taskRepository = taskRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.validatorService = validatorService;
    }
    async createClockIn(user, clockInCreateDto, files) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const existingClockIn = await this.clockInRepository.findOne({
            where: {
                user: { id: user.id },
                clockInTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            relations: ['user'],
        });
        if (existingClockIn) {
            throw new common_1.BadRequestException('You have already clocked in.');
        }
        if (files && files.length > 0) {
            for (const file of files) {
                if (!this.validatorService.isImage(file.mimetype)) {
                    throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
                }
            }
        }
        let clockInImageUrls = [];
        if (files && files.length > 0) {
            clockInImageUrls = await this.firebaseStorageService.uploadFiles(files, folder_name_1.FolderName.CheckIn);
        }
        const clockIn = this.clockInRepository.create({
            user,
            clockInImageUrls,
            clockInLatitude: clockInCreateDto.latitude,
            clockInLongitude: clockInCreateDto.longitude,
            clockInTime: new Date(),
        });
        return this.clockInRepository.save(clockIn);
    }
    async createClockOut(user, clockOutCreateDto, files) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const clockIn = await this.clockInRepository.findOne({
            where: {
                user: { id: user.id },
                clockInTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            relations: ['user'],
        });
        if (!clockIn) {
            throw new common_1.BadRequestException('Clock-in not found for this task');
        }
        if (clockIn.clockOutTime) {
            throw new common_1.BadRequestException('You have already clocked out.');
        }
        if (files && files.length > 0) {
            for (const file of files) {
                if (!this.validatorService.isImage(file.mimetype)) {
                    throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
                }
            }
        }
        let clockOutImageUrls = [];
        if (files && files.length > 0) {
            clockOutImageUrls = await this.firebaseStorageService.uploadFiles(files, folder_name_1.FolderName.CheckOut);
        }
        clockIn.clockOutImageUrls = clockOutImageUrls;
        clockIn.clockOutLatitude = clockOutCreateDto.latitude;
        clockIn.clockOutLongitude = clockOutCreateDto.longitude;
        clockIn.clockOutTime = new Date();
        return this.clockInRepository.save(clockIn);
    }
    async getClockInByUserId(userId, pageOptionsDto) {
        const queryBuilder = this.clockInRepository
            .createQueryBuilder('clockIn')
            .innerJoinAndSelect('clockIn.user', 'user')
            .where('user.id = :userId', { userId });
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const clockInDtos = items.map((clockIn) => new clock_in_dto_1.ClockInDto(clockIn));
        return new page_dto_1.PageDto(clockInDtos, pageMetaDto);
    }
    async getClockInByDate(userId, date) {
        const parsedDate = (0, dayjs_1.default)(date).format('YYYY-MM-DD');
        if (!(0, dayjs_1.default)(date).isValid()) {
            throw new common_1.BadRequestException('Invalid date format. Please use ISO 8601.');
        }
        const queryBuilder = this.clockInRepository
            .createQueryBuilder('clockIn')
            .innerJoinAndSelect('clockIn.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('DATE(clockIn.clockInTime) = :date', { date: parsedDate });
        const clockIn = await queryBuilder.getOne();
        return clockIn ? new clock_in_dto_1.ClockInDto(clockIn) : null;
    }
    async addClockInImage(user, file) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const clockIn = await this.clockInRepository.findOne({
            where: {
                user: { id: user.id },
                clockInTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            relations: ['user'],
        });
        if (!clockIn) {
            throw new common_1.NotFoundException('Clock in record is not found!');
        }
        if (!this.validatorService.isImage(file.mimetype)) {
            throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
        }
        const newClockInImageUrl = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.CheckIn);
        clockIn.clockInImageUrls?.push(newClockInImageUrl.fileUrl);
        await this.clockInRepository.save(clockIn);
        return new clock_in_dto_1.ClockInDto(clockIn);
    }
    async addClockOutImage(user, file) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const clockIn = await this.clockInRepository.findOne({
            where: {
                user: { id: user.id },
                clockInTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            relations: ['user'],
        });
        if (!clockIn) {
            throw new common_1.NotFoundException('Clock in record is not found!');
        }
        if (!clockIn.clockOutImageUrls) {
            throw new common_1.BadRequestException('You have not clocked out yet');
        }
        if (!this.validatorService.isImage(file.mimetype)) {
            throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
        }
        const newClockOutImageUrl = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.CheckOut);
        clockIn.clockOutImageUrls.push(newClockOutImageUrl.fileUrl);
        await this.clockInRepository.save(clockIn);
        return new clock_in_dto_1.ClockInDto(clockIn);
    }
};
exports.ClockInService = ClockInService;
exports.ClockInService = ClockInService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(clock_in_entity_1.ClockInEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(task_entity_1.TaskEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        firebase_storage_service_1.FirebaseStorageService,
        validator_service_1.ValidatorService])
], ClockInService);
//# sourceMappingURL=clock-in.service.js.map