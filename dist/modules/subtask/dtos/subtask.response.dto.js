"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubTaskResponseDto = void 0;
class SubTaskResponseDto {
    id;
    content;
    isCompleted;
    parentTask;
    constructor(task) {
        this.id = task.id;
        this.content = task.content;
        this.isCompleted = task.isCompleted;
        this.parentTask = task.parentTask;
    }
}
exports.SubTaskResponseDto = SubTaskResponseDto;
//# sourceMappingURL=subtask.response.dto.js.map