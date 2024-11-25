"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseStorageService = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("node:path"));
const common_1 = require("@nestjs/common");
const admin = tslib_1.__importStar(require("firebase-admin"));
const uuid_1 = require("uuid");
let FirebaseStorageService = class FirebaseStorageService {
    constructor() {
        const serviceAccountPath = path.resolve(__dirname, '../../../vermelha-88923-firebase-adminsdk-dz0c7-e4e3f671f9.json');
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountPath),
                storageBucket: process.env.STORAGE_BUCKET,
            });
        }
    }
    async uploadFile(file, folder) {
        const bucket = admin.storage().bucket();
        const fileName = `${folder}/${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: (0, uuid_1.v4)(),
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
    async uploadFiles(files, folder) {
        const bucket = admin.storage().bucket();
        const uploadPromises = files.map((file) => {
            const fileName = `${folder}/${Date.now()}_${file.originalname}`;
            const fileUpload = bucket.file(fileName);
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: (0, uuid_1.v4)(),
                    },
                },
            });
            return new Promise((resolve, reject) => {
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
    async deleteFile(filePath) {
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);
        await file
            .delete()
            .then(() => {
            console.log(`File ${filePath} deleted successfully.`);
        })
            .catch((error) => {
            console.error('Error deleting file:', error);
            throw new Error(`Unable to delete file: ${filePath}`);
        });
    }
};
exports.FirebaseStorageService = FirebaseStorageService;
exports.FirebaseStorageService = FirebaseStorageService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], FirebaseStorageService);
//# sourceMappingURL=firebase-storage.service.js.map