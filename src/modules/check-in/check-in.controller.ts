import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { CheckInService } from './check-in.service';
import { CheckInDto } from './dtos/check-in.dto';
import { CheckInCreateDto } from './dtos/check-in-create.dto';

@ApiTags('check-ins')
@Controller('check-ins')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new check-in' })
  @ApiCreatedResponse({ type: CheckInDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          format: 'uuid',
        },
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
  async checkIn(
    @AuthUser() user: UserEntity,
    @Body() checkInCreateDto: CheckInCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<CheckInDto> {
    const checkInEntity = await this.checkInService.createCheckIn(
      checkInCreateDto,
      user,
      files,
    );

    return new CheckInDto(checkInEntity);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post('check-out')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new check-out' })
  @ApiCreatedResponse({ type: CheckInDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          format: 'uuid',
        },
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
  async checkOut(
    @AuthUser() user: UserEntity,
    @Body() checkOutCreateDto: CheckInCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<CheckInDto> {
    const checkInEntity = await this.checkInService.createCheckOut(
      checkOutCreateDto,
      user,
      files,
    );

    return new CheckInDto(checkInEntity);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Get('my-check-in/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Retrieve the check-in and check-out information for the logged-in user by task ID',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID of the task to retrieve check-in information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get check-in and check-out for the logged-in user by task ID',
    type: CheckInDto,
  })
  async getMyCheckInByTaskId(
    @AuthUser() user: UserEntity,
    @UUIDParam('taskId') taskId: Uuid,
  ): Promise<CheckInDto> {
    const userId = user.id;

    return this.checkInService.getCheckInByUserAndTask(userId, taskId);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all check-in and check-out information by task ID',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID of the task to retrieve check-in information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get check-in and check-out by task ID',
    type: CheckInDto,
  })
  async getByTaskId(@UUIDParam('taskId') taskId: Uuid): Promise<CheckInDto[]> {
    return this.checkInService.getByTaskId(taskId);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Put('/add-checkin-image/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'taskId',
    description: 'UUID of the task to add check in image',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CheckInDto,
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
  async addCheckInImage(
    @AuthUser() user: UserEntity,
    @UUIDParam('taskId') taskId: Uuid,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CheckInDto> {
    if (!file) {
      throw new BadRequestException('File image is required');
    }

    return this.checkInService.addCheckInImage(taskId, file, user);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Put('/add-checkout-image/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'taskId',
    description: 'UUID of the task to add check out image',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CheckInDto,
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
  async addCheckOutImage(
    @AuthUser() user: UserEntity,
    @UUIDParam('taskId') taskId: Uuid,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CheckInDto> {
    if (!file) {
      throw new BadRequestException('File image is required');
    }

    return this.checkInService.addCheckOutImage(taskId, file, user);
  }
}
