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
import { AreaService } from './area.service';
import { AreaDto } from './dtos/area.dto';
import { AreaCreateDto } from './dtos/area-create.dto';

@Controller('areas')
@ApiTags('areas')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new area' })
  @ApiCreatedResponse({ type: AreaDto })
  @ApiBody({
    type: AreaCreateDto,
    description: 'Details of the area to be created',
  })
  async createArea(@Body() areaCreateDto: AreaCreateDto) {
    const areaEntity = await this.areaService.createArea(areaCreateDto);

    return new AreaDto(areaEntity);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of areas' })
  @ApiPageResponse({
    description: 'Get areas list',
    type: PageDto,
  })
  getAreas(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<AreaDto>> {
    return this.areaService.getAreas(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific area by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the area to retrieve' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get area',
    type: AreaDto,
  })
  getArea(@UUIDParam('id') areaId: Uuid): Promise<AreaDto> {
    return this.areaService.getArea(areaId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing area' })
  @ApiParam({ name: 'id', description: 'UUID of the area to update' })
  @ApiBody({
    type: AreaCreateDto,
    description: 'Updated area data',
  })
  @ApiOkResponse({ description: 'Area updated successfully' })
  updateArea(
    @UUIDParam('id') id: Uuid,
    @Body() areaUpdateDto: AreaCreateDto,
  ): Promise<void> {
    return this.areaService.updateArea(id, areaUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific area' })
  @ApiParam({ name: 'id', description: 'UUID of the area to delete' })
  @ApiNoContentResponse({ description: 'Area deleted successfully' })
  async deleteArea(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.areaService.deleteArea(id);
  }
}
