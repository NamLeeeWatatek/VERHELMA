"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportDto = exports.ProjectReportDto = exports.UserReportDto = void 0;
class UserReportDto {
    doneTasks = [];
    inProgressTasks = [];
    toDoTasks = [];
    onHoldTasks = [];
    cancelledTasks = [];
    taskTotal = 0;
    totalWorkingTime = 0;
    checkedInTaskCount = 0;
    uncheckedInTaskCount = 0;
}
exports.UserReportDto = UserReportDto;
class ProjectReportDto {
    projectInfo;
    doneTasks = [];
    inProgressTasks = [];
    toDoTasks = [];
    onHoldTasks = [];
    cancelledTasks = [];
    overdueTasks = [];
    taskTotal = 0;
    workingUsers = [];
}
exports.ProjectReportDto = ProjectReportDto;
class ReportDto {
    doneTasks = [];
    inProgressTasks = [];
    toDoTasks = [];
    onHoldTasks = [];
    cancelledTasks = [];
    awaitingVerificationTasks = [];
    overdueTasks = [];
}
exports.ReportDto = ReportDto;
//# sourceMappingURL=report.response.dto.js.map