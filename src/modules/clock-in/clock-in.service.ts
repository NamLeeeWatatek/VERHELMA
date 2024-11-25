import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageOptionsDto } from 'common/dto/page-options.dto';
import dayjs from 'dayjs';
import { Between, Repository } from 'typeorm';

import { PageDto } from '../../common/dto/page.dto';
import { FolderName } from '../../constants/folder-name';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { TaskEntity } from '../task/task.entity';
import type { UserEntity } from '../user/user.entity';
import { ClockInEntity } from './clock-in.entity';
import { ClockInDto } from './dtos/clock-in.dto';
import type { ClockInCreateDto } from './dtos/clock-in-create.dto';

@Injectable()
export class ClockInService {
  constructor(
    @InjectRepository(ClockInEntity)
    private clockInRepository: Repository<ClockInEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private firebaseStorageService: FirebaseStorageService,
    private validatorService: ValidatorService,
  ) {}

  async createClockIn(
    user: UserEntity,
    clockInCreateDto: ClockInCreateDto,
    files?: Express.Multer.File[],
  ): Promise<ClockInEntity> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const existingClockIn = await this.clockInRepository.findOne({
      where: {
        user: { id: user.id },
        clockInTime: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
    });

    if (existingClockIn) {
      throw new BadRequestException('You have already clocked in.');
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

    let clockInImageUrls: string[] = [];

    if (files && files.length > 0) {
      clockInImageUrls = await this.firebaseStorageService.uploadFiles(
        files,
        FolderName.CheckIn,
      );
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

  async createClockOut(
    user: UserEntity,
    clockOutCreateDto: ClockInCreateDto,
    files?: Express.Multer.File[],
  ): Promise<ClockInEntity> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const clockIn = await this.clockInRepository.findOne({
      where: {
        user: { id: user.id },
        clockInTime: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
    });

    if (!clockIn) {
      throw new BadRequestException('Clock-in not found for this task');
    }

    if (clockIn.clockOutTime) {
      throw new BadRequestException('You have already clocked out.');
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

    let clockOutImageUrls: string[] = [];

    if (files && files.length > 0) {
      clockOutImageUrls = await this.firebaseStorageService.uploadFiles(
        files,
        FolderName.CheckOut,
      );
    }

    clockIn.clockOutImageUrls = clockOutImageUrls;
    clockIn.clockOutLatitude = clockOutCreateDto.latitude;
    clockIn.clockOutLongitude = clockOutCreateDto.longitude;
    clockIn.clockOutTime = new Date();

    return this.clockInRepository.save(clockIn);
  }

  async getClockInByUserId(
    userId: Uuid,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ClockInDto>> {
    const queryBuilder = this.clockInRepository
      .createQueryBuilder('clockIn')
      .innerJoinAndSelect('clockIn.user', 'user')
      .where('user.id = :userId', { userId });

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    const clockInDtos = items.map((clockIn) => new ClockInDto(clockIn));

    return new PageDto<ClockInDto>(clockInDtos, pageMetaDto);
  }

  async getClockInByDate(
    userId: Uuid,
    date: string,
  ): Promise<ClockInDto | null> {
    const parsedDate = dayjs(date).format('YYYY-MM-DD');

    if (!dayjs(date).isValid()) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO 8601.',
      );
    }

    const queryBuilder = this.clockInRepository
      .createQueryBuilder('clockIn')
      .innerJoinAndSelect('clockIn.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('DATE(clockIn.clockInTime) = :date', { date: parsedDate });

    const clockIn = await queryBuilder.getOne();

    return clockIn ? new ClockInDto(clockIn) : null;
  }

  async addClockInImage(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<ClockInDto> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const clockIn = await this.clockInRepository.findOne({
      where: {
        user: { id: user.id },
        clockInTime: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
    });

    if (!clockIn) {
      throw new NotFoundException('Clock in record is not found!');
    }

    if (!this.validatorService.isImage(file.mimetype)) {
      throw new BadRequestException('Only image files (jpeg, png) are allowed');
    }

    const newClockInImageUrl = await this.firebaseStorageService.uploadFile(
      file,
      FolderName.CheckIn,
    );

    clockIn.clockInImageUrls?.push(newClockInImageUrl.fileUrl);

    await this.clockInRepository.save(clockIn);

    return new ClockInDto(clockIn);
  }

  async addClockOutImage(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<ClockInDto> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const clockIn = await this.clockInRepository.findOne({
      where: {
        user: { id: user.id },
        clockInTime: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
    });

    if (!clockIn) {
      throw new NotFoundException('Clock in record is not found!');
    }

    if (!clockIn.clockOutImageUrls) {
      throw new BadRequestException('You have not clocked out yet');
    }

    if (!this.validatorService.isImage(file.mimetype)) {
      throw new BadRequestException('Only image files (jpeg, png) are allowed');
    }

    const newClockOutImageUrl = await this.firebaseStorageService.uploadFile(
      file,
      FolderName.CheckOut,
    );

    clockIn.clockOutImageUrls.push(newClockOutImageUrl.fileUrl);

    await this.clockInRepository.save(clockIn);

    return new ClockInDto(clockIn);
  }
}
