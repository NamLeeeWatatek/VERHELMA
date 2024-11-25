import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PageDto } from '../../common/dto/page.dto';
import {
  ApiFile,
  ApiPageResponse,
  AuthUser,
  UUIDParam,
} from '../../decorators';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception'; // Add this import
import { AuthGuard } from '../../guards/auth.guard';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import { LocationDto } from '../../shared/dtos/location.dto';
import { TranslationService } from '../../shared/services/translation.service';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UserDto } from './dtos/user.dto';
import type { UserBasicDto } from './dtos/user-basic.response.dto';
import { UserFilterDto } from './dtos/user-filter.dto';
import { UserLocationTrackingDto } from './dtos/user-location-tracking.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

class AssignRoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  roleId!: Uuid;

  constructor(roleId: Uuid) {
    this.roleId = roleId;
  }
}

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) {}

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${user.firstName}`,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
    @Query(new ValidationPipe({ transform: true }))
    userFilterDto: UserFilterDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto, userFilterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by ID',
    type: UserDto,
  })
  async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Updated' })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        birthday: {
          type: 'string',
          format: 'date',
          nullable: true,
        },
        phoneNumber: {
          type: 'string',
          nullable: true,
        },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateUser(
    @UUIDParam('id') userId: Uuid,
    @Body() userUpdateDto: UserUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ message: string; user: UserDto }> {
    const updatedUser = await this.userService.updateUser(
      userId,
      userUpdateDto,
      file,
    );

    if (!updatedUser) {
      throw new UserNotFoundException();
    }

    return { message: 'User updated successfully', user: updatedUser.toDto() }; // Updated return structure
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @UUIDParam('id')
    userId: Uuid,
  ): Promise<{ message: string }> {
    await this.userService.deleteUser(userId);

    return { message: 'User deleted successfully' }; // Added return structure
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async createUser(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserDto> {
    const newUser = await this.userService.createUser(userRegisterDto, file); // Call the service to create a user

    return newUser.toDto();
  }

  @Post(':id/assign-role')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role assigned successfully' })
  async assignRoleToUser(
    @UUIDParam('id') userId: Uuid,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<{ message: string }> {
    await this.userService.assignRoleToUser(userId, assignRoleDto.roleId);

    return { message: 'Role assigned successfully' };
  }

  @Delete(':id/remove-role')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Role assigned successfully' })
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  async removeRole(
    @UUIDParam('id') userId: Uuid,
  ): Promise<{ message: string }> {
    await this.userService.removeRoleFromUser(userId);

    return { message: 'Role assigned successfully' };
  }

  @Get(':id/last-seen')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get user's last seen location by ID",
    type: UserLocationTrackingDto,
  })
  async getLastSeenLocation(
    @UUIDParam('id') userId: Uuid,
  ): Promise<UserLocationTrackingDto> {
    return this.userService.getLastSeenLocation(userId);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Post('/location')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully location updated' })
  async updateLocation(
    @AuthUser() user: UserEntity,
    @Body() location: LocationDto,
  ): Promise<void> {
    return this.userService.updateLocation(user, location);
  }

  @Put('/set-supervisor/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Successfully set supervisor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        supervisorId: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  async setSupervisor(
    @UUIDParam('userId') userId: Uuid,
    @Body() supervisor: { supervisorId: Uuid },
  ): Promise<void> {
    return this.userService.setSupervisor(userId, supervisor.supervisorId);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Get('subordinates/:userId')
  getSubordinates(@UUIDParam('userId') userId: Uuid): Promise<UserBasicDto[]> {
    return this.userService.getSubordinates(userId);
  }
}
