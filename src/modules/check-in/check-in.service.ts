import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FolderName } from '../../constants/folder-name';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { TaskEntity } from '../task/task.entity';
import type { UserEntity } from '../user/user.entity';
import { CheckInEntity } from './check-in.entity';
import { CheckInDto } from './dtos/check-in.dto';
import type { CheckInCreateDto } from './dtos/check-in-create.dto';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private firebaseStorageService: FirebaseStorageService,
    private validatorService: ValidatorService,
  ) {}

  private async verifyUserAssignment(
    taskId: Uuid,
    userId: Uuid,
  ): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignedUsers'],
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    const isUserAssigned = task.assignedUsers?.some(
      (assignment) => assignment.userId === userId,
    );

    if (!isUserAssigned) {
      throw new BadRequestException('User is not assigned to this task');
    }

    return task;
  }

  async createCheckIn(
    checkInCreateDto: CheckInCreateDto,
    user: UserEntity,
    files?: Express.Multer.File[],
  ): Promise<CheckInEntity> {
    const task = await this.verifyUserAssignment(
      checkInCreateDto.taskId,
      user.id,
    );

    const existingCheckIn = await this.checkInRepository.findOne({
      where: { user: { id: user.id }, task: { id: checkInCreateDto.taskId } },
    });

    if (existingCheckIn) {
      throw new BadRequestException('You have already checked in.');
    }

    if (task.isCheckInPhotoRequired && (!files || files.length === 0)) {
      throw new BadRequestException('Images are required for this task.');
    }

    if (files && files.length > 0) {
      for (const file of files) {
        if (!this.validatorService.isImage(file.mimetype)) {
          throw new BadRequestException(
            'Only image files (jpeg, png) are allowed',
          );
        }
      }
    }

    let checkInImageUrls: string[] = [];

    if (files && files.length > 0) {
      checkInImageUrls = await this.firebaseStorageService.uploadFiles(
        files,
        FolderName.CheckIn,
      );
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

  async createCheckOut(
    checkOutCreateDto: CheckInCreateDto,
    user: UserEntity,
    files?: Express.Multer.File[],
  ): Promise<CheckInEntity> {
    const task = await this.verifyUserAssignment(
      checkOutCreateDto.taskId,
      user.id,
    );

    const checkIn = await this.checkInRepository.findOne({
      where: { user: { id: user.id }, task: { id: checkOutCreateDto.taskId } },
    });

    if (!checkIn) {
      throw new BadRequestException('Check-in not found for this task');
    }

    const existingCheckOut = await this.checkInRepository.findOne({
      where: { user: { id: user.id }, task: { id: checkOutCreateDto.taskId } },
    });

    if (existingCheckOut?.checkOutTime) {
      throw new BadRequestException('You have already checked out.');
    }

    if (task.isCheckOutPhotoRequired && (!files || files.length === 0)) {
      throw new BadRequestException('Images are required for check out.');
    }

    if (files && files.length > 0) {
      for (const file of files) {
        if (!this.validatorService.isImage(file.mimetype)) {
          throw new BadRequestException(
            'Only image files (jpeg, png) are allowed',
          );
        }
      }
    }

    let checkOutImageUrls: string[] = [];

    if (files && files.length > 0) {
      checkOutImageUrls = await this.firebaseStorageService.uploadFiles(
        files,
        FolderName.CheckOut,
      );
    }

    checkIn.checkOutImageUrls = checkOutImageUrls;
    checkIn.checkOutLatitude = checkOutCreateDto.latitude;
    checkIn.checkOutLongitude = checkOutCreateDto.longitude;
    checkIn.checkOutTime = new Date();

    return this.checkInRepository.save(checkIn);
  }

  async getCheckInByUserAndTask(
    userId: Uuid,
    taskId: Uuid,
  ): Promise<CheckInDto> {
    const checkIn = await this.checkInRepository.findOne({
      where: { user: { id: userId }, task: { id: taskId } },
    });

    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    return new CheckInDto(checkIn);
  }

  async getByTaskId(taskId: Uuid): Promise<CheckInDto[]> {
    const checkIns = await this.checkInRepository.find({
      where: { task: { id: taskId } },
    });

    if (checkIns.length > 0) {
      return checkIns.map((checkIn) => new CheckInDto(checkIn));
    }

    return [];
  }

  async addCheckInImage(
    taskId: Uuid,
    file: Express.Multer.File,
    user: UserEntity,
  ): Promise<CheckInDto> {
    await this.verifyUserAssignment(taskId, user.id);

    const checkIn = await this.checkInRepository.findOne({
      where: { user: { id: user.id }, task: { id: taskId } },
    });

    if (!checkIn) {
      throw new NotFoundException('Check in record is not found!');
    }

    if (!this.validatorService.isImage(file.mimetype)) {
      throw new BadRequestException('Only image files (jpeg, png) are allowed');
    }

    const newCheckInImageUrl = await this.firebaseStorageService.uploadFile(
      file,
      FolderName.CheckIn,
    );

    checkIn.checkInImageUrls?.push(newCheckInImageUrl.fileUrl);

    await this.checkInRepository.save(checkIn);

    return new CheckInDto(checkIn);
  }

  async addCheckOutImage(
    taskId: Uuid,
    file: Express.Multer.File,
    user: UserEntity,
  ): Promise<CheckInDto> {
    await this.verifyUserAssignment(taskId, user.id);

    const checkIn = await this.checkInRepository.findOne({
      where: { user: { id: user.id }, task: { id: taskId } },
    });

    if (!checkIn) {
      throw new NotFoundException('Check in record is not found!');
    }

    if (!checkIn.checkOutImageUrls) {
      throw new BadRequestException('You have not checked out yet');
    }

    if (!this.validatorService.isImage(file.mimetype)) {
      throw new BadRequestException('Only image files (jpeg, png) are allowed');
    }

    const newCheckOutImageUrl = await this.firebaseStorageService.uploadFile(
      file,
      FolderName.CheckOut,
    );

    checkIn.checkOutImageUrls.push(newCheckOutImageUrl.fileUrl);

    await this.checkInRepository.save(checkIn);

    return new CheckInDto(checkIn);
  }
}
