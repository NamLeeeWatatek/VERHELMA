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
import { ApiPageResponse, AuthUser, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { UserEntity } from '../../modules/user/user.entity';
import { DocumentService } from './document.service';
import { DocumentDto } from './dtos/document.dto';
import { DocumentCreateDto } from './dtos/document-create.dto';

@Controller('documents')
@ApiTags('documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post()
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new document' })
  @ApiCreatedResponse({ type: DocumentDto })
  @UseInterceptors(FileInterceptor('document'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
          nullable: true,
        },
        isPublic: {
          type: 'boolean',
          nullable: true,
        },
        categoryId: {
          type: 'Uuid',
          nullable: true,
        },
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createDocument(
    @AuthUser() user: UserEntity,
    @Body() documentCreateDto: DocumentCreateDto,
    @UploadedFile() document: Express.Multer.File,
  ): Promise<DocumentDto> {
    const createdDocument = await this.documentService.create(
      documentCreateDto,
      document,
      user,
    );

    return createdDocument.toDto();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of documents' })
  @ApiPageResponse({
    description: 'Get documents list',
    type: PageDto,
  })
  getDocuments(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentDto>> {
    return this.documentService.getList(pageOptionsDto);
  }

  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Retrieve a paginated list of documents according to the category.',
  })
  @ApiPageResponse({
    description: 'Get documents list by categoryId',
    type: PageDto,
  })
  getDocumentsByCategoryId(
    @UUIDParam('categoryId') categoryId: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DocumentDto>> {
    return this.documentService.getListByCategoryId(categoryId, pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific document by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the document to retrieve' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get document',
    type: DocumentDto,
  })
  getDocument(@UUIDParam('id') documentId: Uuid): Promise<DocumentDto> {
    return this.documentService.get(documentId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing document' })
  @ApiParam({ name: 'id', description: 'UUID of the document to update' })
  @ApiBody({
    type: DocumentCreateDto,
    description: 'Updated document data',
  })
  @ApiOkResponse({ description: 'Document updated successfully' })
  updateDocument(
    @UUIDParam('id') id: Uuid,
    @Body() documentUpdateDto: DocumentCreateDto,
  ): Promise<void> {
    return this.documentService.update(id, documentUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific document' })
  @ApiParam({ name: 'id', description: 'UUID of the document to delete' })
  @ApiNoContentResponse({ description: 'Document deleted successfully' })
  async delete(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.documentService.delete(id);
  }
}
