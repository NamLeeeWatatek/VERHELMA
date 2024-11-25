import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorService {
  public isImage(mimeType: string): boolean {
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'image/tiff',
      'image/x-icon',
      'application/octet-stream',
    ];

    return imageMimeTypes.includes(mimeType);
  }

  public isDocument(mimeType: string): boolean {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    return allowedMimeTypes.includes(mimeType);
  }
}
