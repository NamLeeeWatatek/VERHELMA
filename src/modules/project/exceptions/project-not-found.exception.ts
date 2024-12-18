import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.projectNotFound', error);
  }
}
