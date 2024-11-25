import { HttpException, HttpStatus } from '@nestjs/common';

export class SubtaskNotFoundException extends HttpException {
  constructor() {
    super(
      'Subtask not found or does not belong to this task',
      HttpStatus.NOT_FOUND,
    );
  }
}
