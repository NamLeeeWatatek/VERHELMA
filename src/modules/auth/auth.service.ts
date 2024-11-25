import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import { TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { RoleDto } from '../role/dtos/role.dto';
import type { UserDto } from '../user/dtos/user.dto';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import type { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleDto | undefined;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { identifier, password } = userLoginDto;

    const normalizedIdentifier = this.isEmail(identifier)
      ? identifier.toLowerCase()
      : identifier;

    const user = await (this.isEmail(identifier)
      ? this.userService.findOne({ email: normalizedIdentifier })
      : this.userService.findOne({ phoneNumber: normalizedIdentifier }));

    if (!user || !(await validateHash(password, user.password))) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async getUser(user: UserEntity): Promise<UserDto> {
    return this.userService.getUser(user.id);
  }

  private isEmail(identifier: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(identifier);
  }
}
