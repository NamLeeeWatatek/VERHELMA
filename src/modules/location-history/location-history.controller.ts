import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { ApiPageResponse, UUIDParam } from '../../decorators';
import type { LocationHistoryBasicDto } from './dtos/location-history-basic.dto';
import { LocationHistoryService } from './location-history.service';

@Controller('location-histories')
@ApiTags('location-history')
export class LocationHistoryController {
  constructor(private locationHistoryService: LocationHistoryService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiPageResponse({
    description: 'Tracking location history',
    type: PageDto,
  })
  @ApiQuery({
    name: 'dateString',
    required: true,
    description: 'Date string for filtering location history',
    type: String,
  })
  async getHistory(
    @UUIDParam('userId') userId: Uuid,
    @Query('dateString') dateString: string,
  ): Promise<LocationHistoryBasicDto[]> {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    return this.locationHistoryService.getHistory(userId, date);
  }
}
