import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser, UUIDParam } from '../../decorators';
import { AuthGuard } from '../../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import type {
  IUserMonthlyReportDto,
  IUserTaskReportDto,
} from './dtos/report.dto';
import type {
  ProjectReportDto,
  ReportDto,
  UserReportDto,
} from './dtos/report.response.dto';
import { ReportFilterDto } from './dtos/report-filter.dto';
import { ReportMonthlyCreateDto } from './dtos/report-monthly-create.dto';
import { ReportRangeCreateDto } from './dtos/report-range-create.dto';
import { ReportService } from './report.service';

@Controller('reports')
@ApiTags('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('/range')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a range report' })
  @ApiCreatedResponse({
    description: 'Created range report successfully!',
  })
  async createRangeReport(
    @Body() dto: ReportRangeCreateDto,
  ): Promise<IUserTaskReportDto[]> {
    return this.reportService.createRangeReport(dto);
  }

  @Post('/monthly')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a monthly report' })
  @ApiCreatedResponse({
    description: 'Created monthly report successfully!',
  })
  async createMonthlyReport(
    @Body() dto: ReportMonthlyCreateDto,
  ): Promise<IUserMonthlyReportDto[]> {
    return this.reportService.createMonthlyReport(dto);
  }

  //   @Get('/project/:projectId')
  //   @HttpCode(HttpStatus.CREATED)
  //   @ApiOperation({ summary: 'Create a monthly report' })
  //   @ApiCreatedResponse({
  //     description: 'Created monthly report successfully!',
  //   })
  //   async getProjectReport(
  //     @UUIDParam('projectId') projectId: Uuid,
  //     @Body() dto: ProjectCreateDto,
  //   ): Promise<IUserMonthlyReportDto[]> {
  //     return this.reportService.createMonthlyReport(dto);
  //   }

  @Get(':userId')
  async getTaskReport(
    @UUIDParam('userId') userId: Uuid,
    @Query('startDate') startDateString: string,
    @Query('endDate') endDateString: string,
  ): Promise<UserReportDto> {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    return this.reportService.generateUserReport(userId, startDate, endDate);
  }

  @Get('project/:projectId')
  async getProjectReport(
    @UUIDParam('projectId') id: Uuid,
  ): Promise<ProjectReportDto> {
    return this.reportService.generateProjectReport(id);
  }

  @Get()
  @UseGuards(AuthGuard({ public: false }))
  @ApiBearerAuth()
  async getReport(
    @AuthUser() requester: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    filterDto: ReportFilterDto,
  ): Promise<ReportDto> {
    return this.reportService.generateReport(requester, filterDto);
  }
}
