"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../constants/role.enum");
const task_status_1 = require("../../constants/task-status");
const check_in_entity_1 = require("../check-in/check-in.entity");
const check_in_info_1 = require("../check-in/dtos/check-in.info");
const farm_entity_1 = require("../farm/farm.entity");
const project_dto_1 = require("../project/dtos/project.dto");
const project_entity_1 = require("../project/project.entity");
const task_basic_dto_1 = require("../task/dtos/task-basic.dto");
const task_entity_1 = require("../task/task.entity");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const user_basic_response_dto_1 = require("../user/dtos/user-basic.response.dto");
const user_entity_1 = require("../user/user.entity");
const report_response_dto_1 = require("./dtos/report.response.dto");
let ReportService = class ReportService {
    taskRepository;
    userRepository;
    projectRepository;
    taskAssignmentRepository;
    checkInRepository;
    farmRepository;
    constructor(taskRepository, userRepository, projectRepository, taskAssignmentRepository, checkInRepository, farmRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.checkInRepository = checkInRepository;
        this.farmRepository = farmRepository;
    }
    async createRangeReport(dto) {
        const { startDate, endDate, projectId, userIds } = dto;
        const users = await this.userRepository.find({
            where: {
                id: (0, typeorm_2.In)(userIds),
            },
        });
        const taskPromises = users.map(async (user) => {
            const tasks = await this.taskRepository.find({
                where: {
                    project: projectId ? { id: projectId } : undefined,
                    assignedUsers: { userId: user.id },
                    startDate: (0, typeorm_2.MoreThanOrEqual)(new Date(startDate)),
                    dueDate: (0, typeorm_2.LessThanOrEqual)(new Date(endDate)),
                },
                relations: ['assignedUsers', 'project', 'area'],
            });
            const { taskReports, totalWorkTime, completedTasksNumber, dailyWorkTime, } = await this.processTasks(user.id, tasks);
            return {
                user: new user_basic_response_dto_1.UserBasicDto(user),
                tasks: taskReports,
                dailyWorkTime,
                totalWorkTime,
                completedTasksNumber,
            };
        });
        return Promise.all(taskPromises);
    }
    async createMonthlyReport(dto) {
        const { monthTime, projectId, userIds } = dto;
        const monthDate = new Date(monthTime);
        const year = monthDate.getUTCFullYear();
        const month = monthDate.getUTCMonth() + 1;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        const users = await this.userRepository.find({
            where: {
                id: (0, typeorm_2.In)(userIds),
            },
        });
        const taskPromises = users.map(async (user) => {
            const tasks = await this.taskRepository.find({
                where: {
                    project: projectId ? { id: projectId } : undefined,
                    assignedUsers: { userId: user.id },
                    startDate: (0, typeorm_2.MoreThanOrEqual)(new Date(startDate)),
                    dueDate: (0, typeorm_2.LessThanOrEqual)(new Date(endDate)),
                },
                relations: ['assignedUsers', 'project'],
                select: ['id', 'status'],
            });
            const taskStatusCount = {
                [task_status_1.TaskStatus.ToDo]: 0,
                [task_status_1.TaskStatus.InProgress]: 0,
                [task_status_1.TaskStatus.Done]: 0,
                [task_status_1.TaskStatus.Cancelled]: 0,
                [task_status_1.TaskStatus.OnHold]: 0,
                [task_status_1.TaskStatus.Overdue]: 0,
                [task_status_1.TaskStatus.Verifying]: 0,
            };
            const checkInPromises = tasks.map(async (task) => {
                const checkIns = await this.checkInRepository.find({
                    where: { userId: user.id, taskId: task.id },
                });
                const checkInInfos = checkIns.map((checkIn) => new check_in_info_1.CheckInInfo(checkIn));
                const taskWorkTime = checkInInfos.reduce((sum, checkIn) => sum + checkIn.workDuration, 0);
                return {
                    status: task.status,
                    workTime: taskWorkTime,
                };
            });
            const checkInResults = await Promise.all(checkInPromises);
            let totalWorkTime = 0;
            for (const { status, workTime } of checkInResults) {
                taskStatusCount[status]++;
                totalWorkTime += workTime;
            }
            return {
                user: new user_basic_response_dto_1.UserBasicDto(user),
                tasksStatistics: taskStatusCount,
                taskTotal: tasks.length,
                totalWorkTime,
            };
        });
        return Promise.all(taskPromises);
    }
    async processTasks(userId, tasks) {
        const taskReports = [];
        const dailyWorkTimeMap = {};
        let completedTasksNumber = 0;
        const checkInPromises = tasks.map(async (task) => {
            const checkIns = await this.checkInRepository.find({
                where: { userId, taskId: task.id },
            });
            this.processCheckIns(checkIns, task, taskReports, dailyWorkTimeMap);
            if (task.status === task_status_1.TaskStatus.Done) {
                completedTasksNumber++;
            }
        });
        await Promise.all(checkInPromises);
        const dailyWorkTime = Object.keys(dailyWorkTimeMap).map((dateString) => ({
            date: new Date(dateString),
            totalMinutesWorked: dailyWorkTimeMap[dateString] ?? 0,
        }));
        const totalWorkTime = dailyWorkTime.reduce((sum, workTime) => sum + workTime.totalMinutesWorked, 0);
        return { taskReports, totalWorkTime, completedTasksNumber, dailyWorkTime };
    }
    processCheckIns(checkIns, task, taskReports, dailyWorkTimeMap) {
        for (const checkIn of checkIns) {
            const checkInInfo = new check_in_info_1.CheckInInfo(checkIn);
            const checkInDate = checkInInfo.checkInTime?.toISOString().split('T')[0];
            if (checkInDate) {
                dailyWorkTimeMap[checkInDate] =
                    (dailyWorkTimeMap[checkInDate] ?? 0) + checkInInfo.workDuration;
            }
            taskReports.push({
                taskInfo: new task_basic_dto_1.TaskBasicDto(task),
                checkInInfo,
            });
        }
    }
    async generateUserReport(userId, startDate, endDate) {
        const tasks = await this.taskRepository.find({
            where: {
                assignedUsers: { userId },
                startDate: (0, typeorm_2.MoreThanOrEqual)(new Date(startDate)),
                dueDate: (0, typeorm_2.LessThanOrEqual)(new Date(endDate)),
            },
            relations: ['assignedUsers'],
        });
        const taskClassification = {
            [task_status_1.TaskStatus.ToDo]: [],
            [task_status_1.TaskStatus.InProgress]: [],
            [task_status_1.TaskStatus.Done]: [],
            [task_status_1.TaskStatus.Cancelled]: [],
            [task_status_1.TaskStatus.OnHold]: [],
            [task_status_1.TaskStatus.Overdue]: [],
            [task_status_1.TaskStatus.Verifying]: [],
        };
        let checkedInTaskCount = 0;
        let uncheckedInTaskCount = 0;
        const checkInPromises = tasks.map(async (task) => {
            const taskDto = new task_basic_dto_1.TaskBasicDto(task);
            if (task.dueDate &&
                task.dueDate.getTime() < Date.now() &&
                task.status !== task_status_1.TaskStatus.Done) {
                taskClassification[task_status_1.TaskStatus.Overdue].push(taskDto);
            }
            else {
                taskClassification[task.status].push(taskDto);
            }
            const checkIn = await this.checkInRepository.findOne({
                where: { userId, taskId: task.id },
            });
            if (checkIn) {
                checkedInTaskCount++;
                const checkInInfo = new check_in_info_1.CheckInInfo(checkIn);
                return checkInInfo.workDuration;
            }
            uncheckedInTaskCount++;
            return 0;
        });
        const checkInResults = await Promise.all(checkInPromises);
        let totalWorkTime = 0;
        for (const workTime of checkInResults) {
            totalWorkTime += workTime;
        }
        const result = new report_response_dto_1.UserReportDto();
        result.doneTasks = taskClassification[task_status_1.TaskStatus.Done];
        result.inProgressTasks = taskClassification[task_status_1.TaskStatus.InProgress];
        result.toDoTasks = taskClassification[task_status_1.TaskStatus.ToDo];
        result.onHoldTasks = taskClassification[task_status_1.TaskStatus.OnHold];
        result.cancelledTasks = taskClassification[task_status_1.TaskStatus.Cancelled];
        result.taskTotal = tasks.length;
        result.totalWorkingTime = totalWorkTime;
        result.checkedInTaskCount = checkedInTaskCount;
        result.uncheckedInTaskCount = uncheckedInTaskCount;
        return result;
    }
    async generateProjectReport(projectId) {
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.farm', 'farm')
            .leftJoinAndSelect('project.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .where('project.id = :projectId', {
            projectId,
        });
        const project = await queryBuilder.getOne();
        if (!project) {
            throw new common_1.NotFoundException('Project not found!');
        }
        const result = new report_response_dto_1.ProjectReportDto();
        result.projectInfo = new project_dto_1.ProjectDto(project);
        const taskClassification = {
            [task_status_1.TaskStatus.ToDo]: [],
            [task_status_1.TaskStatus.InProgress]: [],
            [task_status_1.TaskStatus.Done]: [],
            [task_status_1.TaskStatus.Cancelled]: [],
            [task_status_1.TaskStatus.OnHold]: [],
            [task_status_1.TaskStatus.Overdue]: [],
            [task_status_1.TaskStatus.Verifying]: [],
        };
        const allTasks = await this.taskRepository.find({
            where: {
                project: { id: projectId },
            },
            relations: ['project'],
        });
        for (const task of allTasks) {
            const taskDto = new task_basic_dto_1.TaskBasicDto(task);
            if (task.dueDate &&
                task.dueDate.getTime() < Date.now() &&
                task.status !== task_status_1.TaskStatus.Done) {
                taskClassification[task_status_1.TaskStatus.Overdue].push(taskDto);
            }
            else {
                taskClassification[task.status].push(taskDto);
            }
        }
        result.workingUsers = project.users.map((user) => new user_basic_response_dto_1.UserBasicDto(user.user));
        result.doneTasks = taskClassification[task_status_1.TaskStatus.Done];
        result.inProgressTasks = taskClassification[task_status_1.TaskStatus.InProgress];
        result.toDoTasks = taskClassification[task_status_1.TaskStatus.ToDo];
        result.onHoldTasks = taskClassification[task_status_1.TaskStatus.OnHold];
        result.cancelledTasks = taskClassification[task_status_1.TaskStatus.Cancelled];
        result.overdueTasks = taskClassification[task_status_1.TaskStatus.Overdue];
        return result;
    }
    async generateReport(requester, reportFilter) {
        if (!requester.role) {
            throw new Error("Haven't logged in yet.");
        }
        console.log("requester.role.name: ", requester.role.name);
        console.log("Role.FARM_MANAGER.toString(): ", role_enum_1.Role.FARM_MANAGER.toString());
        console.log("result: ", requester.role.name === role_enum_1.Role.FARM_MANAGER.toString());
        if (requester.role.name !== role_enum_1.Role.SUPERVISOR.toString() &&
            requester.role.name !== role_enum_1.Role.FARM_MANAGER.toString()) {
            throw new Error("Don't have permission with your role.");
        }
        const queryBuilder = this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('project.farm', 'farm')
            .leftJoinAndSelect('task.area', 'area');
        const farm = await this.farmRepository.findOne({
            where: { id: reportFilter.farmId },
            relations: ['farmManager'],
        });
        if (!farm) {
            throw new common_1.BadRequestException('Not exist farm!');
        }
        queryBuilder.andWhere('farm.id = :farmId', {
            farmId: reportFilter.farmId,
        });
        if (reportFilter.projectId) {
            const project = await this.projectRepository.findOne({
                where: { id: reportFilter.projectId },
                relations: ['farm'],
            });
            if (!project) {
                throw new common_1.BadRequestException('Not exist project!');
            }
            if (project.farm.id !== reportFilter.farmId) {
                throw new common_1.BadRequestException("This project doesn't belong to farm !");
            }
            queryBuilder.andWhere('project.id = :projectId', {
                projectId: reportFilter.projectId,
            });
        }
        if (reportFilter.areaId) {
            queryBuilder.andWhere('area.id = :areaId', {
                areaId: reportFilter.areaId,
            });
        }
        if (reportFilter.userId) {
            queryBuilder
                .innerJoin('task.assignedUsers', 'assignedUsers')
                .andWhere('assignedUsers.userId = :userId', {
                userId: reportFilter.userId,
            });
        }
        if ((reportFilter.startDate && !reportFilter.endDate) ??
            (!reportFilter.startDate && reportFilter.endDate)) {
            throw new common_1.BadRequestException('Invalid range time!');
        }
        if (reportFilter.startDate && reportFilter.endDate) {
            queryBuilder.andWhere('task.startDate BETWEEN :startDate AND :endDate', {
                startDate: reportFilter.startDate,
                endDate: reportFilter.endDate,
            });
        }
        const allTasks = await queryBuilder.getMany();
        const taskClassification = {
            [task_status_1.TaskStatus.ToDo]: [],
            [task_status_1.TaskStatus.InProgress]: [],
            [task_status_1.TaskStatus.Done]: [],
            [task_status_1.TaskStatus.Cancelled]: [],
            [task_status_1.TaskStatus.OnHold]: [],
            [task_status_1.TaskStatus.Overdue]: [],
            [task_status_1.TaskStatus.Verifying]: [],
        };
        for (const task of allTasks) {
            const taskDto = new task_basic_dto_1.TaskBasicDto(task);
            if (task.dueDate &&
                task.dueDate.getTime() < Date.now() &&
                task.status !== task_status_1.TaskStatus.Done) {
                taskClassification[task_status_1.TaskStatus.Overdue].push(taskDto);
            }
            else {
                taskClassification[task.status].push(taskDto);
            }
        }
        const result = new report_response_dto_1.ReportDto();
        result.doneTasks = taskClassification[task_status_1.TaskStatus.Done];
        result.inProgressTasks = taskClassification[task_status_1.TaskStatus.InProgress];
        result.toDoTasks = taskClassification[task_status_1.TaskStatus.ToDo];
        result.onHoldTasks = taskClassification[task_status_1.TaskStatus.OnHold];
        result.cancelledTasks = taskClassification[task_status_1.TaskStatus.Cancelled];
        result.awaitingVerificationTasks = taskClassification[task_status_1.TaskStatus.Verifying];
        result.overdueTasks = taskClassification[task_status_1.TaskStatus.Overdue];
        return result;
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = tslib_1.__decorate([
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_entity_1.TaskEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectEntity)),
    tslib_1.__param(3, (0, typeorm_1.InjectRepository)(task_assignment_entity_1.TaskAssignmentEntity)),
    tslib_1.__param(4, (0, typeorm_1.InjectRepository)(check_in_entity_1.CheckInEntity)),
    tslib_1.__param(5, (0, typeorm_1.InjectRepository)(farm_entity_1.FarmEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportService);
//# sourceMappingURL=report.service.js.map