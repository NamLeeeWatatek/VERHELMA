"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_dto_1 = require("../../common/dto/page.dto");
const utils_1 = require("../../common/utils");
const notification_type_enum_1 = require("../../constants/notification-type.enum");
const role_enum_1 = require("../../constants/role.enum");
const task_status_1 = require("../../constants/task-status");
const firebase_cloud_messaging_service_1 = require("../../shared/services/firebase-cloud-messaging.service");
const area_entity_1 = require("../area/area.entity");
const daily_scheduled_tasked_entity_1 = require("../daily-scheduled-task/daily-scheduled-tasked.entity");
const notification_create_dto_1 = require("../notification/dtos/notification-create.dto");
const notification_service_1 = require("../notification/notification.service");
const project_entity_1 = require("../project/project.entity");
const subtask_entity_1 = require("../subtask/subtask.entity");
const task_assignment_entity_1 = require("../task-assignment/task-assignment.entity");
const user_entity_1 = require("../user/user.entity");
const employee_location_response_dto_1 = require("./dtos/employee-location.response.dto");
const task_dto_1 = require("./dtos/task.dto");
const subtask_not_found_exception_1 = require("./exceptions/subtask-not-found-exception");
const task_not_found_exception_1 = require("./exceptions/task-not-found.exception");
const task_entity_1 = require("./task.entity");
let TaskService = class TaskService {
    taskRepository;
    userRepository;
    areaRepository;
    projectRepository;
    taskAssignmentRepository;
    dailyScheduledTaskRepository;
    subtaskRepository;
    firebaseCloudMessagingService;
    notificationService;
    constructor(taskRepository, userRepository, areaRepository, projectRepository, taskAssignmentRepository, dailyScheduledTaskRepository, subtaskRepository, firebaseCloudMessagingService, notificationService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
        this.projectRepository = projectRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.dailyScheduledTaskRepository = dailyScheduledTaskRepository;
        this.subtaskRepository = subtaskRepository;
        this.firebaseCloudMessagingService = firebaseCloudMessagingService;
        this.notificationService = notificationService;
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
    async createTask(taskCreateDto, authUser) {
        const task = this.taskRepository.create({
            title: taskCreateDto.title,
            description: taskCreateDto.description,
            priority: taskCreateDto.priority,
            startDate: taskCreateDto.startDate,
            dueDate: taskCreateDto.dueDate,
            createdBy: authUser,
            status: taskCreateDto.status,
            isCheckInPhotoRequired: taskCreateDto.isCheckInPhotoRequired,
            isCheckOutPhotoRequired: taskCreateDto.isCheckOutPhotoRequired,
        });
        if (taskCreateDto.sourceTaskId) {
            task.sourceTask = await this.findEntity(this.dailyScheduledTaskRepository, taskCreateDto.sourceTaskId, 'Source task not found');
        }
        if (taskCreateDto.areaId) {
            task.area = await this.findEntity(this.areaRepository, taskCreateDto.areaId, 'Area not found');
        }
        if (taskCreateDto.projectId) {
            task.project = await this.findEntity(this.projectRepository, taskCreateDto.projectId, 'Project not found');
        }
        if (taskCreateDto.verifierId) {
            const verifier = await this.userRepository.findOne({
                where: {
                    id: taskCreateDto.verifierId,
                    role: { name: role_enum_1.Role.SUPERVISOR },
                },
                relations: ['role'],
            });
            if (!verifier) {
                throw new common_1.BadRequestException('Verifier not found!');
            }
            task.verifier = verifier;
        }
        await this.taskRepository.save(task);
        if (taskCreateDto.assignedUserIds &&
            taskCreateDto.assignedUserIds.length > 0) {
            task.assignedUsers = await Promise.all(taskCreateDto.assignedUserIds.map(async (userId) => {
                const user = await this.findEntity(this.userRepository, userId, 'User not found when assigning');
                const taskAssignment = new task_assignment_entity_1.TaskAssignmentEntity();
                taskAssignment.userId = user.id;
                taskAssignment.taskId = task.id;
                taskAssignment.user = user;
                return this.taskAssignmentRepository.save(taskAssignment);
            }));
            const assignedDeviceTokens = task.assignedUsers
                .map((assignedUser) => assignedUser.user?.deviceToken)
                .filter((token) => token !== undefined && token !== null);
            if (assignedDeviceTokens.length > 0) {
                await this.firebaseCloudMessagingService.subscribeMultipleToTopic(assignedDeviceTokens, task.id);
            }
            await this.firebaseCloudMessagingService.sendNotificationToTopic(task.id, 'You have just assigned to a new task', task.title);
            const assignedUserIds = task.assignedUsers
                .map((assignedUser) => assignedUser.user?.id)
                .filter((token) => token !== undefined);
            const notificationDto = new notification_create_dto_1.NotificationCreateDto();
            notificationDto.title = `You have just been asssigned into task ${task.title}`;
            notificationDto.body = task.id;
            notificationDto.type = notification_type_enum_1.NotificationType.CREATE_TASK;
            await this.notificationService.createNotificationForManyUsers(assignedUserIds, notificationDto);
        }
        let subtasks = [];
        if (taskCreateDto.subtaskContents &&
            taskCreateDto.subtaskContents.length > 0) {
            subtasks = await Promise.all(taskCreateDto.subtaskContents.map(async (subtaskContent) => {
                const subtask = this.subtaskRepository.create({
                    content: subtaskContent,
                    parentTask: task,
                });
                return this.subtaskRepository.save(subtask);
            }));
        }
        task.subtasks = subtasks;
        return task;
    }
    async getTasks(pageOptionsDto, filterDto) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
            .leftJoinAndSelect('assignedUsers.user', 'user')
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.subtasks', 'subtasks')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'creator')
            .leftJoinAndSelect('task.verifier', 'verifier')
            .orderBy('task.createdAt', 'DESC');
        const allowedSortColumns = [
            'createdAt',
            'title',
            'startDate',
            'dueDate',
            'status',
            'priority',
        ];
        if (pageOptionsDto.orderBy === 'area') {
            queryBuilder.orderBy('area.name', pageOptionsDto.order || 'ASC');
        }
        else if (pageOptionsDto.orderBy === 'project') {
            queryBuilder.orderBy('project.name', pageOptionsDto.order || 'ASC');
        }
        else {
            (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'task', allowedSortColumns);
        }
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(task.title) LIKE :title', {
                title: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        this.applyFilters(queryBuilder, filterDto);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const taskDtos = items.map((task) => new task_dto_1.TaskDto(task));
        return new page_dto_1.PageDto(taskDtos, pageMetaDto);
    }
    async getLoggedInUserTasks(user, pageOptionsDto, filterDto) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
            .leftJoinAndSelect('assignedUsers.user', 'user')
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.subtasks', 'subtasks')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'creator')
            .leftJoinAndSelect('task.verifier', 'verifier')
            .orderBy('task.createdAt', 'DESC')
            .where('user.id = :userId', { userId: user.id });
        const allowedSortColumns = [
            'createdAt',
            'title',
            'startDate',
            'dueDate',
            'status',
            'priority',
        ];
        if (pageOptionsDto.orderBy === 'area') {
            queryBuilder.orderBy('area.name', pageOptionsDto.order || 'ASC');
        }
        else if (pageOptionsDto.orderBy === 'project') {
            queryBuilder.orderBy('project.name', pageOptionsDto.order || 'ASC');
        }
        else {
            (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'task', allowedSortColumns);
        }
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(task.title) LIKE :title', {
                title: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        this.applyFilters(queryBuilder, filterDto);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const taskDtos = items.map((task) => new task_dto_1.TaskDto(task));
        return new page_dto_1.PageDto(taskDtos, pageMetaDto);
    }
    async getTasksToVerify(user, pageOptionsDto, filterDto) {
        if (!user.role || user.role.name !== role_enum_1.Role.SUPERVISOR.toString()) {
            throw new common_1.BadRequestException('User is not a supervisor');
        }
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
            .leftJoinAndSelect('assignedUsers.user', 'user')
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.subtasks', 'subtasks')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'creator')
            .leftJoinAndSelect('task.verifier', 'verifier')
            .where('verifier.id = :verifierId', { verifierId: user.id })
            .orderBy('task.createdAt', 'DESC');
        const allowedSortColumns = [
            'createdAt',
            'title',
            'startDate',
            'dueDate',
            'status',
            'priority',
        ];
        if (pageOptionsDto.orderBy === 'area') {
            queryBuilder.orderBy('area.name', pageOptionsDto.order || 'ASC');
        }
        else if (pageOptionsDto.orderBy === 'project') {
            queryBuilder.orderBy('project.name', pageOptionsDto.order || 'ASC');
        }
        else {
            (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'task', allowedSortColumns);
        }
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(task.title) LIKE :title', {
                title: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        this.applyFilters(queryBuilder, filterDto);
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const taskDtos = items.map((task) => new task_dto_1.TaskDto(task));
        return new page_dto_1.PageDto(taskDtos, pageMetaDto);
    }
    applyFilters(query, filterDto) {
        const { status, priority, startDateRange, dueDateRange, isCheckInPhotoRequired, isCheckOutPhotoRequired, projectId, areaId, } = filterDto;
        if (status) {
            if (status === task_status_1.TaskStatus.Overdue) {
                query.andWhere(`(task.dueDate IS NOT NULL AND DATE(task.dueDate) < DATE(:currentDate) AND task.status != :doneStatus)`, {
                    currentDate: new Date(),
                    doneStatus: task_status_1.TaskStatus.Done,
                });
            }
            else {
                query.andWhere('task.status = :status', { status });
            }
        }
        if (priority) {
            query.andWhere('task.priority = :priority', { priority });
        }
        if (startDateRange) {
            if (startDateRange.length > 2) {
                throw new common_1.BadRequestException('StartDate range time is invalid!');
            }
            let start, end;
            if (startDateRange.length === 1) {
                start = new Date(`${startDateRange[0]}T00:00:00.000Z`);
                end = new Date(`${startDateRange[0]}T23:59:59.999Z`);
            }
            else {
                start = new Date(`${startDateRange[0]}T00:00:00.000Z`);
                end = new Date(`${startDateRange[1]}T23:59:59.999Z`);
            }
            query.andWhere('task.startDate BETWEEN :start AND :end', {
                start,
                end,
            });
        }
        if (dueDateRange) {
            if (dueDateRange.length > 2) {
                throw new common_1.BadRequestException('DueDate range time is invalid!');
            }
            let start, end;
            if (dueDateRange.length === 1) {
                start = new Date(`${dueDateRange[0]}T00:00:00.000Z`);
                end = new Date(`${dueDateRange[0]}T23:59:59.999Z`);
            }
            else {
                start = new Date(`${dueDateRange[0]}T00:00:00.000Z`);
                end = new Date(`${dueDateRange[1]}T23:59:59.999Z`);
            }
            query.andWhere('task.dueDate BETWEEN :start AND :end', {
                start,
                end,
            });
        }
        if (isCheckInPhotoRequired !== undefined) {
            query.andWhere('task.isCheckInPhotoRequired = :isCheckInPhotoRequired', {
                isCheckInPhotoRequired,
            });
        }
        if (isCheckOutPhotoRequired !== undefined) {
            query.andWhere('task.isCheckOutPhotoRequired = :isCheckOutPhotoRequired', { isCheckOutPhotoRequired });
        }
        if (projectId) {
            query.andWhere('task.project.id = :projectId', { projectId });
        }
        if (areaId) {
            query.andWhere('task.area.id = :areaId', { areaId });
        }
        return query;
    }
    async getTask(taskId) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'creator')
            .leftJoinAndSelect('task.subtasks', 'subtasks')
            .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
            .leftJoinAndSelect('assignedUsers.user', 'user')
            .leftJoinAndSelect('task.verifier', 'verifier')
            .where('task.id = :taskId', { taskId });
        const taskEntity = await queryBuilder.getOne();
        if (!taskEntity) {
            throw new common_1.NotFoundException('Task not found');
        }
        return new task_dto_1.TaskDto(taskEntity);
    }
    async updateTask(taskId, taskUpdateDto) {
        const taskEntity = await this.taskRepository.findOne({
            where: { id: taskId },
        });
        if (!taskEntity) {
            throw new task_not_found_exception_1.TaskNotFoundException();
        }
        this.updateTaskProperties(taskEntity, taskUpdateDto);
        await this.updateRelatedEntities(taskEntity, taskUpdateDto);
    }
    updateTaskProperties(taskEntity, taskUpdateDto) {
        taskEntity.title = taskUpdateDto.title;
        taskEntity.description = taskUpdateDto.description;
        taskEntity.priority = taskUpdateDto.priority;
        taskEntity.startDate = taskUpdateDto.startDate;
        taskEntity.dueDate = taskUpdateDto.dueDate;
        taskEntity.status = taskUpdateDto.status ?? task_status_1.TaskStatus.ToDo;
        taskEntity.isCheckInPhotoRequired = taskUpdateDto.isCheckInPhotoRequired;
        taskEntity.isCheckOutPhotoRequired = taskUpdateDto.isCheckOutPhotoRequired;
    }
    async updateRelatedEntities(task, taskUpdateDto) {
        if (taskUpdateDto.areaId) {
            task.area = await this.findEntity(this.areaRepository, taskUpdateDto.areaId, 'Area not found');
        }
        if (taskUpdateDto.projectId) {
            task.project = await this.findEntity(this.projectRepository, taskUpdateDto.projectId, 'Project not found');
        }
        if (taskUpdateDto.verifierId) {
            const verifier = await this.userRepository.findOne({
                where: {
                    id: taskUpdateDto.verifierId,
                    role: { name: role_enum_1.Role.SUPERVISOR },
                },
                relations: ['role'],
            });
            if (!verifier) {
                throw new common_1.BadRequestException('Verifier not found!');
            }
            task.verifier = verifier;
        }
        await this.taskRepository.save(task);
        if (taskUpdateDto.assignedUserIds &&
            taskUpdateDto.assignedUserIds.length > 0) {
            const currentAssignments = await this.taskAssignmentRepository.find({
                where: { taskId: task.id },
                relations: ['user'],
            });
            const unsubscribedDeviceTokens = currentAssignments
                .filter((assignment) => !taskUpdateDto.assignedUserIds.includes(assignment.userId))
                .map((assignment) => assignment.user?.deviceToken)
                .filter((token) => token !== undefined && token !== null);
            if (unsubscribedDeviceTokens.length > 0) {
                await this.firebaseCloudMessagingService.unsubscribeMultipleToTopic(unsubscribedDeviceTokens, task.id);
            }
            if (currentAssignments.length > 0) {
                await this.taskAssignmentRepository.remove(currentAssignments.filter((assignment) => !taskUpdateDto.assignedUserIds?.includes(assignment.userId)));
            }
            const newAssignedDeviceTokens = [];
            const newAssignedUserIds = [];
            const currentUserIds = new Set(currentAssignments.map((assignment) => assignment.userId));
            task.assignedUsers = await Promise.all(taskUpdateDto.assignedUserIds
                .filter((userId) => !currentUserIds.has(userId))
                .map(async (id) => {
                const user = await this.findEntity(this.userRepository, id, 'User not found when assigning');
                const taskAssignment = new task_assignment_entity_1.TaskAssignmentEntity();
                taskAssignment.user = user;
                taskAssignment.task = task;
                if (user.deviceToken) {
                    newAssignedDeviceTokens.push(user.deviceToken);
                }
                newAssignedUserIds.push(user.id);
                return this.taskAssignmentRepository.save(taskAssignment);
            }));
            await this.notifyNewAssignments(task, newAssignedDeviceTokens, newAssignedUserIds);
        }
    }
    async notifyNewAssignments(task, newAssignedDeviceTokens, newAssignedUserIds) {
        if (newAssignedDeviceTokens.length > 0) {
            await this.firebaseCloudMessagingService.subscribeMultipleToTopic(newAssignedDeviceTokens, task.id);
            await this.firebaseCloudMessagingService.sendNotificationToDevices(newAssignedDeviceTokens, 'You are assigned to a new task', task.title);
        }
        if (newAssignedUserIds.length > 0) {
            const notificationDto = new notification_create_dto_1.NotificationCreateDto();
            notificationDto.title = `You have been just asssigned into task ${task.title}`;
            notificationDto.body = task.id;
            notificationDto.type = notification_type_enum_1.NotificationType.UPDATE_TASK;
            await this.notificationService.createNotificationForManyUsers(newAssignedUserIds, notificationDto);
        }
    }
    async updateTaskStatus(taskId, taskStatus) {
        const taskEntity = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['verifier'],
        });
        if (!taskEntity) {
            throw new task_not_found_exception_1.TaskNotFoundException();
        }
        if (taskStatus === task_status_1.TaskStatus.Verifying && !taskEntity.verifier) {
            throw new common_1.BadRequestException("This task doesn't have verifier!");
        }
        taskEntity.status = taskStatus;
        await this.taskRepository.save(taskEntity);
    }
    async deleteTask(taskId) {
        const queryBuilder = this.taskRepository
            .createQueryBuilder('task')
            .where('task.id = :id', { id: taskId });
        const taskEntity = await queryBuilder.getOne();
        if (!taskEntity) {
            throw new task_not_found_exception_1.TaskNotFoundException();
        }
        await this.taskRepository.remove(taskEntity);
    }
    async getTasksByUserId(userId, pageOptionsDto) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        queryBuilder
            .leftJoinAndSelect('task.area', 'area')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('task.createdBy', 'creator')
            .leftJoinAndSelect('task.subtasks', 'subtasks')
            .leftJoinAndSelect('task.verifier', 'verifier')
            .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
            .leftJoinAndSelect('assignedUsers.user', 'user')
            .where('user.id = :userId', { userId });
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        const taskDtos = items.map((task) => new task_dto_1.TaskDto(task));
        return new page_dto_1.PageDto(taskDtos, pageMetaDto);
    }
    async assignTaskToUsers(taskId, userIds) {
        const taskEntity = await this.taskRepository.findOne({
            where: { id: taskId },
        });
        if (!taskEntity) {
            throw new task_not_found_exception_1.TaskNotFoundException();
        }
        const currentAssignments = await this.taskAssignmentRepository.find({
            where: { taskId },
        });
        if (currentAssignments.length > 0) {
            await this.taskAssignmentRepository.remove(currentAssignments);
        }
        taskEntity.assignedUsers = await Promise.all(userIds.map(async (userId) => {
            const user = await this.findEntity(this.userRepository, userId, 'User not found when assigning');
            const taskAssignment = new task_assignment_entity_1.TaskAssignmentEntity();
            taskAssignment.user = user;
            taskAssignment.task = taskEntity;
            return this.taskAssignmentRepository.save(taskAssignment);
        }));
    }
    async updateSubtaskContent(taskId, subTaskId, updateContent) {
        const subtask = await this.subtaskRepository.findOne({
            where: { id: subTaskId, parentTask: { id: taskId } },
        });
        if (!subtask) {
            throw new subtask_not_found_exception_1.SubtaskNotFoundException();
        }
        subtask.content = updateContent;
        return this.subtaskRepository.save(subtask);
    }
    async changeSubtaskStatus(taskId, subtaskId) {
        const subtask = await this.subtaskRepository.findOne({
            where: { id: subtaskId, parentTask: { id: taskId } },
        });
        if (!subtask) {
            throw new subtask_not_found_exception_1.SubtaskNotFoundException();
        }
        subtask.isCompleted = !subtask.isCompleted;
        await this.subtaskRepository.save(subtask);
    }
    async deleteSubtask(taskId, subtaskId) {
        const subtask = await this.subtaskRepository.findOne({
            where: { id: subtaskId, parentTask: { id: taskId } },
        });
        if (!subtask) {
            throw new subtask_not_found_exception_1.SubtaskNotFoundException();
        }
        await this.subtaskRepository.remove(subtask);
    }
    async createNewSubtask(taskId, subtaskContent) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
        });
        if (!task) {
            throw new Error('Parent task not found');
        }
        const subtask = this.subtaskRepository.create({
            content: subtaskContent,
            isCompleted: false,
            parentTask: task,
        });
        return this.subtaskRepository.save(subtask);
    }
    async getEmployeeLocations(user, taskId) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['createdBy', 'assignedUsers'],
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.createdBy?.id !== user.id) {
            throw new Error("User does not have permission to access this task's locations");
        }
        const locations = [];
        if (task.assignedUsers && task.assignedUsers.length > 0) {
            const userPromises = task.assignedUsers.map(async (assignment) => {
                const userEntity = await this.userRepository.findOne({
                    where: { id: assignment.userId },
                });
                if (!userEntity) {
                    throw new Error(`Assigned user not found for userId: ${assignment.userId}`);
                }
                return new employee_location_response_dto_1.EmployeeLocationDto(userEntity);
            });
            try {
                const results = await Promise.all(userPromises);
                locations.push(...results);
            }
            catch (error) {
                throw new Error('Error retrieving assigned users: ' + error.message);
            }
        }
        return locations;
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_entity_1.TaskEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(area_entity_1.AreaEntity)),
    tslib_1.__param(3, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectEntity)),
    tslib_1.__param(4, (0, typeorm_1.InjectRepository)(task_assignment_entity_1.TaskAssignmentEntity)),
    tslib_1.__param(5, (0, typeorm_1.InjectRepository)(daily_scheduled_tasked_entity_1.DailyScheduledTaskEntity)),
    tslib_1.__param(6, (0, typeorm_1.InjectRepository)(subtask_entity_1.SubtaskEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        firebase_cloud_messaging_service_1.FirebaseCloudMessagingService,
        notification_service_1.NotificationService])
], TaskService);
//# sourceMappingURL=task.service.js.map