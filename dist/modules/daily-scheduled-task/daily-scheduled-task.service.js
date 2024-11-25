"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyScheduledTaskService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const typeorm_2 = require("typeorm");
const page_dto_1 = require("../../common/dto/page.dto");
const area_entity_1 = require("../area/area.entity");
const check_in_entity_1 = require("../check-in/check-in.entity");
const project_entity_1 = require("../project/project.entity");
const task_entity_1 = require("../task/task.entity");
const task_service_1 = require("../task/task.service");
const daily_scheduled_tasked_entity_1 = require("./daily-scheduled-tasked.entity");
const daily_scheduled_tasked_dto_1 = require("./dtos/daily-scheduled-tasked.dto");
let DailyScheduledTaskService = class DailyScheduledTaskService {
    dailyScheduledTaskRepository;
    taskRepository;
    checkInRepository;
    areaRepository;
    projectRepository;
    taskService;
    constructor(dailyScheduledTaskRepository, taskRepository, checkInRepository, areaRepository, projectRepository, taskService) {
        this.dailyScheduledTaskRepository = dailyScheduledTaskRepository;
        this.taskRepository = taskRepository;
        this.checkInRepository = checkInRepository;
        this.areaRepository = areaRepository;
        this.projectRepository = projectRepository;
        this.taskService = taskService;
    }
    async findEntity(repository, id, notFoundMessage) {
        const entity = await repository.findOne({
            where: { id },
        });
        if (!entity) {
            throw new common_1.NotFoundException(notFoundMessage);
        }
        return entity;
    }
    async create(createDto, authUser) {
        const dailyScheduledTask = this.dailyScheduledTaskRepository.create(createDto);
        if (createDto.areaId) {
            dailyScheduledTask.area = await this.findEntity(this.areaRepository, createDto.areaId, 'Area not found');
        }
        if (createDto.projectId) {
            dailyScheduledTask.project = await this.findEntity(this.projectRepository, createDto.projectId, 'Project not found');
        }
        dailyScheduledTask.createdBy = authUser;
        const savedDailyScheduledTask = await this.dailyScheduledTaskRepository.save(dailyScheduledTask);
        const { startDate, endDate, startTime, endTime, ...taskInfo } = createDto;
        const taskStartTime = startTime ?? '00:00:00';
        const taskEndTime = endTime ?? '23:59:59';
        const diffDays = (0, dayjs_1.default)(endDate).diff((0, dayjs_1.default)(startDate), 'day');
        const taskPromises = Array.from({ length: diffDays + 1 }, (_, i) => {
            const currentStartDate = (0, dayjs_1.default)(startDate)
                .add(i, 'day')
                .format('YYYY-MM-DD');
            const taskStartDate = (0, dayjs_1.default)(`${currentStartDate} ${taskStartTime}`, 'YYYY-MM-DD HH:mm').toDate();
            const taskEndDate = (0, dayjs_1.default)(`${currentStartDate} ${taskEndTime}`, 'YYYY-MM-DD HH:mm').toDate();
            const taskCreateDto = {
                ...taskInfo,
                startDate: taskStartDate,
                dueDate: taskEndDate,
                sourceTaskId: savedDailyScheduledTask.id,
            };
            return this.taskService.createTask(taskCreateDto, authUser);
        });
        await Promise.all(taskPromises);
        return savedDailyScheduledTask;
    }
    async findAll(pageOptionsDto) {
        const queryBuilder = this.dailyScheduledTaskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'createdBy');
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const taskDtos = items.map((task) => new daily_scheduled_tasked_dto_1.DailyScheduledTaskDto(task));
        return new page_dto_1.PageDto(taskDtos, pageMetaDto);
    }
    async findOne(id) {
        const queryBuilder = this.dailyScheduledTaskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'createdBy')
            .where('task.id = :id', { id });
        const task = await queryBuilder.getOne();
        if (!task) {
            throw new Error(`DailyScheduledTask with id ${id} not found`);
        }
        return task;
    }
    async findDailyScheduledTask(id) {
        const task = await this.dailyScheduledTaskRepository.findOne({
            where: { id },
            relations: ['dailyTasks', 'createdBy'],
        });
        if (!task) {
            throw new Error('DailyScheduledTask not found');
        }
        return task;
    }
    async getTasksWithCheckIns(dailyScheduledTask) {
        const checkInPromises = dailyScheduledTask.dailyTasks?.map(async (task) => {
            const hasCheckIn = await this.checkInRepository.findOne({
                where: { taskId: task.id },
            });
            return { task, hasCheckIn };
        });
        return Promise.all(checkInPromises ?? []);
    }
    async update(id, updateDto) {
        const dailyScheduledTask = await this.findDailyScheduledTask(id);
        let tasksWithCheckIns = await this.getTasksWithCheckIns(dailyScheduledTask);
        const oldStartDate = dailyScheduledTask.startDate;
        const oldEndDate = dailyScheduledTask.endDate;
        if (updateDto.areaId) {
            dailyScheduledTask.area = await this.findEntity(this.areaRepository, updateDto.areaId, 'Area not found');
        }
        if (updateDto.projectId) {
            dailyScheduledTask.project = await this.findEntity(this.projectRepository, updateDto.projectId, 'Project not found');
        }
        this.dailyScheduledTaskRepository.merge(dailyScheduledTask, updateDto);
        await this.dailyScheduledTaskRepository.save(dailyScheduledTask);
        const newStartDate = updateDto.startDate;
        const newEndDate = updateDto.endDate;
        if (!(0, dayjs_1.default)(newStartDate).isSame(oldStartDate) ||
            !(0, dayjs_1.default)(newEndDate).isSame(oldEndDate)) {
            const tasksToDelete = tasksWithCheckIns
                .filter(({ hasCheckIn }) => !hasCheckIn)
                .map(({ task }) => task);
            if (Array.isArray(tasksToDelete) && tasksToDelete.length > 0) {
                await this.taskRepository.remove(tasksToDelete);
            }
            tasksWithCheckIns = tasksWithCheckIns.filter(({ task }) => !tasksToDelete.includes(task));
        }
        const { startDate, endDate, startTime, endTime, ...taskInfo } = updateDto;
        const taskStartTime = startTime ?? '00:00:00';
        const taskEndTime = endTime ?? '23:59:59';
        const diffDays = (0, dayjs_1.default)(endDate).diff((0, dayjs_1.default)(startDate), 'day');
        const taskPromises = Array.from({ length: diffDays + 1 }, async (_, i) => {
            const currentStartDate = (0, dayjs_1.default)(startDate)
                .add(i, 'day')
                .format('YYYY-MM-DD');
            const existingTask = tasksWithCheckIns.find(({ task }) => (0, dayjs_1.default)(task.startDate).format('YYYY-MM-DD') === currentStartDate);
            if (existingTask) {
                const task = await this.taskRepository.findOne({
                    where: { id: existingTask.task.id },
                });
                if (task) {
                    this.taskRepository.merge(task, {
                        ...taskInfo,
                        startDate: (0, dayjs_1.default)(`${currentStartDate} ${taskStartTime}`).toDate(),
                        dueDate: (0, dayjs_1.default)(`${currentStartDate} ${taskEndTime}`).toDate(),
                    });
                    return this.taskRepository.save(existingTask.task);
                }
            }
            const taskStartDate = (0, dayjs_1.default)(`${currentStartDate} ${taskStartTime}`, 'YYYY-MM-DD HH:mm').toDate();
            const taskEndDate = (0, dayjs_1.default)(`${currentStartDate} ${taskEndTime}`, 'YYYY-MM-DD HH:mm').toDate();
            const taskCreateDto = {
                ...taskInfo,
                startDate: taskStartDate,
                dueDate: taskEndDate,
                sourceTaskId: dailyScheduledTask.id,
            };
            return this.taskService.createTask(taskCreateDto, dailyScheduledTask.createdBy);
        });
        await Promise.all(taskPromises);
    }
    async remove(id) {
        const taskEntity = await this.taskRepository.findOne({
            where: { id },
        });
        if (!taskEntity) {
            return false;
        }
        await this.taskRepository.remove(taskEntity);
        return true;
    }
};
exports.DailyScheduledTaskService = DailyScheduledTaskService;
exports.DailyScheduledTaskService = DailyScheduledTaskService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(daily_scheduled_tasked_entity_1.DailyScheduledTaskEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(task_entity_1.TaskEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(check_in_entity_1.CheckInEntity)),
    tslib_1.__param(3, (0, typeorm_1.InjectRepository)(area_entity_1.AreaEntity)),
    tslib_1.__param(4, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        task_service_1.TaskService])
], DailyScheduledTaskService);
//# sourceMappingURL=daily-scheduled-task.service.js.map