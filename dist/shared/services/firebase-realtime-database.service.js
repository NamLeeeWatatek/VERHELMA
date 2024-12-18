"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFirestoreService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const admin = tslib_1.__importStar(require("firebase-admin"));
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../modules/user/user.entity");
let FirebaseFirestoreService = class FirebaseFirestoreService {
    userRepository;
    firestore;
    constructor(userRepository) {
        this.userRepository = userRepository;
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
        this.firestore = admin.firestore();
    }
    async syncUsersToFirebase() {
        const users = await this.userRepository.find();
        const batch = this.firestore.batch();
        for (const user of users) {
            const docRef = this.firestore.collection('users').doc(user.id.toString());
            const userData = {
                displayName: `${user.firstName} ${user.lastName}`,
                id: user.id,
                phoneNumber: user.phoneNumber,
                photoUrl: user.avatar,
            };
            batch.set(docRef, userData);
        }
        await batch.commit();
    }
    async syncNewUserToFirebase(user) {
        const batch = this.firestore.batch();
        const docRef = this.firestore.collection('users').doc(user.id.toString());
        const userData = {
            displayName: `${user.firstName} ${user.lastName}`,
            id: user.id,
            phoneNumber: user.phoneNumber,
            photoUrl: user.avatar,
        };
        batch.set(docRef, userData);
        await batch.commit();
    }
};
exports.FirebaseFirestoreService = FirebaseFirestoreService;
tslib_1.__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FirebaseFirestoreService.prototype, "syncUsersToFirebase", null);
exports.FirebaseFirestoreService = FirebaseFirestoreService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], FirebaseFirestoreService);
//# sourceMappingURL=firebase-realtime-database.service.js.map