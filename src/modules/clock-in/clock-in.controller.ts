import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import type { PageDto } from 'common/dto/page.dto';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AuthUser, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { ClockInService } from './clock-in.service';
import { ClockInDto } from './dtos/clock-in.dto';
import { ClockInCreateDto } from './dtos/clock-in-create.dto';

class GetClockInByDateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDateString({}, { message: 'Invalid date format. Use ISO 8601 format.' })
  date!: string;
}

@ApiTags('clock-ins')
@Controller('clock-ins')
export class ClockInController {
  constructor(private readonly clockInService: ClockInService) {}

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new clock-in' })
  @ApiCreatedResponse({ type: ClockInDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          nullable: true,
        },
        longitude: {
          type: 'number',
          nullable: true,
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async clockIn(
    @AuthUser() user: UserEntity,
    @Body() clockInCreateDto: ClockInCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ClockInDto> {
    const clockInEntity = await this.clockInService.createClockIn(
      user,
      clockInCreateDto,
      files,
    );

    return new ClockInDto(clockInEntity);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post('clock-out')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new clock-out' })
  @ApiCreatedResponse({ type: ClockInDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          nullable: true,
        },
        longitude: {
          type: 'number',
          nullable: true,
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async clockOut(
    @AuthUser() user: UserEntity,
    @Body() clockOutCreateDto: ClockInCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ClockInDto> {
    const clockInEntity = await this.clockInService.createClockOut(
      user,
      clockOutCreateDto,
      files,
    );

    return new ClockInDto(clockInEntity);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Get('my-clock-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Retrieve the clock-in and clock-out information for the logged-in user by task ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get clock-in and clock-out for the logged-in user by task ID',
    type: ClockInDto,
  })
  async getMyClockIn(
    @AuthUser() user: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ClockInDto>> {
    return this.clockInService.getClockInByUserId(user.id, pageOptionsDto);
  }

  @UseGuards(AuthGuard({ public: true }))
  @ApiBearerAuth()
  @Get('by-date')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClockInDto,
  })
  async getClockInByDate(
    @AuthUser() user: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    query: GetClockInByDateDto,
  ): Promise<ClockInDto | null> {
    const { date } = query;

    return this.clockInService.getClockInByDate(user.id, date);
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all clock-in and clock-out information by user ID',
  })
  async getByUserId(
    @UUIDParam('userId') userId: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ClockInDto>> {
    return this.clockInService.getClockInByUserId(userId, pageOptionsDto);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all clock-in and clock-out information by user ID',
  })
  async getUserClockInInfo(
    @UUIDParam('userId') userId: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    query: GetClockInByDateDto,
  ): Promise<ClockInDto | null> {
    return this.clockInService.getClockInByDate(userId, query.date);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Put('/add-clockin-image')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClockInDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async addClockInImage(
    @AuthUser() user: UserEntity,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ClockInDto> {
    if (!file) {
      throw new BadRequestException('File image is required');
    }

    return this.clockInService.addClockInImage(user, file);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Put('/add-clockout-image')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClockInDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async addClockOutImage(
    @AuthUser() user: UserEntity,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ClockInDto> {
    if (!file) {
      throw new BadRequestException('File image is required');
    }

    return this.clockInService.addClockOutImage(user, file);
  }
}
