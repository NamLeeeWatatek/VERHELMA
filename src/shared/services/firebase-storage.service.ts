import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FirebaseStorageService {
  constructor() {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ fileUrl: string; filePath: string }> {
    const bucket = admin.storage().bucket();
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;

    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidV4(),
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        const filePath = fileName;

        resolve({
          fileUrl: publicUrl,
          filePath,
        });
      });

      stream.end(file.buffer);
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const bucket = admin.storage().bucket();

    const uploadPromises = files.map((file) => {
      const fileName = `${folder}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuidV4(),
          },
        },
      });

      return new Promise<string>((resolve, reject) => {
        stream.on('error', (error) => {
          reject(error);
        });

        stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(publicUrl);
        });

        stream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    await file
      .delete()

      // eslint-disable-next-line promise/always-return
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(`File ${filePath} deleted successfully.`);
      })
      .catch((error) => {
        console.error('Error deleting file:', error);

        throw new Error(`Unable to delete file: ${filePath}`);
      });
  }
}
