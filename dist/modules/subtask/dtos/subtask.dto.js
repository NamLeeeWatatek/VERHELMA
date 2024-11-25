"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtaskDto = void 0;
class SubtaskDto {
    id;
    content;
    isCompleted = false;
    constructor(subtask) {
        this.id = subtask.id;
        this.content = subtask.content;
        this.isCompleted = subtask.isCompleted;
    }
}
exports.SubtaskDto = SubtaskDto;
//# sourceMappingURL=subtask.dto.js.map