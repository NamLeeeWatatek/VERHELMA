"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const folder_name_1 = require("../../constants/folder-name");
const firebase_storage_service_1 = require("../../shared/services/firebase-storage.service");
const validator_service_1 = require("../../shared/services/validator.service");
const task_entity_1 = require("../task/task.entity");
const check_in_entity_1 = require("./check-in.entity");
const check_in_dto_1 = require("./dtos/check-in.dto");
let CheckInService = class CheckInService {
    checkInRepository;
    taskRepository;
    firebaseStorageService;
    validatorService;
    constructor(checkInRepository, taskRepository, firebaseStorageService, validatorService) {
        this.checkInRepository = checkInRepository;
        this.taskRepository = taskRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.validatorService = validatorService;
    }
    async verifyUserAssignment(taskId, userId) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['assignedUsers'],
        });
        if (!task) {
            throw new common_1.BadRequestException('Task not found');
        }
        const isUserAssigned = task.assignedUsers?.some((assignment) => assignment.userId === userId);
        if (!isUserAssigned) {
            throw new common_1.BadRequestException('User is not assigned to this task');
        }
        return task;
    }
    async createCheckIn(checkInCreateDto, user, files) {
        const task = await this.verifyUserAssignment(checkInCreateDto.taskId, user.id);
        const existingCheckIn = await this.checkInRepository.findOne({
            where: { user: { id: user.id }, task: { id: checkInCreateDto.taskId } },
        });
        if (existingCheckIn) {
            throw new common_1.BadRequestException('You have already checked in.');
        }
        if (task.isCheckInPhotoRequired && (!files || files.length === 0)) {
            throw new common_1.BadRequestException('Images are required for this task.');
        }
        if (files && files.length > 0) {
            for (const file of files) {
                if (!this.validatorService.isImage(file.mimetype)) {
                    throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
                }
            }
        }
        let checkInImageUrls = [];
        if (files && files.length > 0) {
            checkInImageUrls = await this.firebaseStorageService.uploadFiles(files, folder_name_1.FolderName.CheckIn);
        }
        const checkIn = this.checkInRepository.create({
            user,
            task,
            checkInImageUrls,
            checkInLatitude: checkInCreateDto.latitude,
            checkInLongitude: checkInCreateDto.longitude,
            checkInTime: new Date(),
        });
        return this.checkInRepository.save(checkIn);
    }
    async createCheckOut(checkOutCreateDto, user, files) {
        const task = await this.verifyUserAssignment(checkOutCreateDto.taskId, user.id);
        const checkIn = await this.checkInRepository.findOne({
            where: { user: { id: user.id }, task: { id: checkOutCreateDto.taskId } },
        });
        if (!checkIn) {
            throw new common_1.BadRequestException('Check-in not found for this task');
        }
        const existingCheckOut = await this.checkInRepository.findOne({
            where: { user: { id: user.id }, task: { id: checkOutCreateDto.taskId } },
        });
        if (existingCheckOut?.checkOutTime) {
            throw new common_1.BadRequestException('You have already checked out.');
        }
        if (task.isCheckOutPhotoRequired && (!files || files.length === 0)) {
            throw new common_1.BadRequestException('Images are required for check out.');
        }
        if (files && files.length > 0) {
            for (const file of files) {
                if (!this.validatorService.isImage(file.mimetype)) {
                    throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
                }
            }
        }
        let checkOutImageUrls = [];
        if (files && files.length > 0) {
            checkOutImageUrls = await this.firebaseStorageService.uploadFiles(files, folder_name_1.FolderName.CheckOut);
        }
        checkIn.checkOutImageUrls = checkOutImageUrls;
        checkIn.checkOutLatitude = checkOutCreateDto.latitude;
        checkIn.checkOutLongitude = checkOutCreateDto.longitude;
        checkIn.checkOutTime = new Date();
        return this.checkInRepository.save(checkIn);
    }
    async getCheckInByUserAndTask(userId, taskId) {
        const checkIn = await this.checkInRepository.findOne({
            where: { user: { id: userId }, task: { id: taskId } },
        });
        if (!checkIn) {
            throw new common_1.NotFoundException('Check-in not found');
        }
        return new check_in_dto_1.CheckInDto(checkIn);
    }
    async getByTaskId(taskId) {
        const checkIns = await this.checkInRepository.find({
            where: { task: { id: taskId } },
        });
        if (checkIns.length > 0) {
            return checkIns.map((checkIn) => new check_in_dto_1.CheckInDto(checkIn));
        }
        return [];
    }
    async addCheckInImage(taskId, file, user) {
        await this.verifyUserAssignment(taskId, user.id);
        const checkIn = await this.checkInRepository.findOne({
            where: { user: { id: user.id }, task: { id: taskId } },
        });
        if (!checkIn) {
            throw new common_1.NotFoundException('Check in record is not found!');
        }
        if (!this.validatorService.isImage(file.mimetype)) {
            throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
        }
        const newCheckInImageUrl = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.CheckIn);
        checkIn.checkInImageUrls?.push(newCheckInImageUrl.fileUrl);
        await this.checkInRepository.save(checkIn);
        return new check_in_dto_1.CheckInDto(checkIn);
    }
    async addCheckOutImage(taskId, file, user) {
        await this.verifyUserAssignment(taskId, user.id);
        const checkIn = await this.checkInRepository.findOne({
            where: { user: { id: user.id }, task: { id: taskId } },
        });
        if (!checkIn) {
            throw new common_1.NotFoundException('Check in record is not found!');
        }
        if (!checkIn.checkOutImageUrls) {
            throw new common_1.BadRequestException('You have not checked out yet');
        }
        if (!this.validatorService.isImage(file.mimetype)) {
            throw new common_1.BadRequestException('Only image files (jpeg, png) are allowed');
        }
        const newCheckOutImageUrl = await this.firebaseStorageService.uploadFile(file, folder_name_1.FolderName.CheckOut);
        checkIn.checkOutImageUrls.push(newCheckOutImageUrl.fileUrl);
        await this.checkInRepository.save(checkIn);
        return new check_in_dto_1.CheckInDto(checkIn);
    }
};
exports.CheckInService = CheckInService;
exports.CheckInService = CheckInService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(check_in_entity_1.CheckInEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(task_entity_1.TaskEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        firebase_storage_service_1.FirebaseStorageService,
        validator_service_1.ValidatorService])
], CheckInService);
//# sourceMappingURL=check-in.service.js.map