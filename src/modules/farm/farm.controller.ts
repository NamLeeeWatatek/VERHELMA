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
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageResponse, UUIDParam } from '../../decorators';
import { FarmDto } from './dtos/farm.dto';
import { FarmCreateDto } from './dtos/farm-create.dto';
import { FarmService } from './farm.service';

@Controller('farms')
@ApiTags('farms')
export class FarmController {
  constructor(private farmService: FarmService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new farm' })
  @ApiCreatedResponse({ type: FarmDto })
  @ApiBody({
    type: FarmCreateDto,
    description: 'Details of the Farm to be created',
  })
  async createFarm(@Body() farmCreateDto: FarmCreateDto) {
    const farmEntity = await this.farmService.createFarm(farmCreateDto);

    return farmEntity.toDto();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of farms' })
  @ApiPageResponse({
    description: 'Get farms list',
    type: PageDto,
  })
  getFarms(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FarmDto>> {
    return this.farmService.getFarms(pageOptionsDto);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of farms' })
  getAllFarms(): Promise<FarmDto[]> {
    return this.farmService.getAllFarms();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific farm by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the farm to retrieve' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get farm',
    type: FarmDto,
  })
  getFarm(@UUIDParam('id') farmId: Uuid): Promise<FarmDto> {
    return this.farmService.getFarm(farmId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing farm' })
  @ApiParam({ name: 'id', description: 'UUID of the farm to update' })
  @ApiBody({
    type: FarmCreateDto,
    description: 'Updated farm data',
  })
  @ApiOkResponse({ description: 'Farm updated successfully' })
  updateFarm(
    @UUIDParam('id') id: Uuid,
    @Body() farmUpdateDto: FarmCreateDto,
  ): Promise<void> {
    return this.farmService.updateFarm(id, farmUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific farm' })
  @ApiParam({ name: 'id', description: 'UUID of the farm to delete' })
  @ApiNoContentResponse({ description: 'Farm deleted successfully' })
  async deleteFarm(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.farmService.deleteFarm(id);
  }
}
