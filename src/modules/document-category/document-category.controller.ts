import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PageDto } from 'common/dto/page.dto';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { DocumentCategoryService } from './document-category.service';
import { DocumentCategoryDto } from './dtos/document-category.dto';
import { DocumentCategoryCreateDto } from './dtos/document-category-create.dto';

@Controller('document-categories')
@ApiTags('document-categories')
export class DocumentCategoryController {
  constructor(
    private readonly documentCategoryService: DocumentCategoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new area' })
  async create(
    @Body() dto: DocumentCategoryCreateDto,
  ): Promise<DocumentCategoryCreateDto> {
    return this.documentCategoryService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of document categories' })
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentCategoryDto>> {
    return this.documentCategoryService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific document category by its ID' })
  async findById(@Param('id') id: Uuid): Promise<DocumentCategoryDto> {
    return this.documentCategoryService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing document category' })
  async update(
    @Param('id') id: number,
    @Body() dto: DocumentCategoryDto,
  ): Promise<void> {
    return this.documentCategoryService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Uuid): Promise<void> {
    return this.documentCategoryService.remove(id);
  }

  @Get('count/:id')
  @HttpCode(HttpStatus.OK)
  async countDocuments(@Param('id') id: Uuid): Promise<number> {
    return this.documentCategoryService.countDocuments(id);
  }
}
