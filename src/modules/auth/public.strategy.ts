import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor(private readonly configService: ApiConfigService) {
    super();
  }

  authenticate(): void {
    this.success({ [Symbol.for('isPublic')]: true });
  }
}
