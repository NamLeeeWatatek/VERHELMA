import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleDto } from '../../modules/role/dtos/role.dto';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @SetMetadata('skipAuth', true)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);
    await this.userService.updateLastLogin(userEntity.id);

    if (userLoginDto.deviceToken) {
      await this.userService.updateDeviceToken(
        userEntity.id,
        userLoginDto.deviceToken,
      );
    }

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role ? new RoleDto(userEntity.role) : undefined,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
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
        password: {
          type: 'string',
          minLength: 6,
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
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file,
    );

    return createdUser.toDto();
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Change password' })
  changeUserPassword(@Body() dto: ChangePasswordDto): Promise<UserDto> {
    return this.userService.updatePassword(dto);
  }

  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): Promise<UserDto> {
    return this.authService.getUser(user);
  }
}
