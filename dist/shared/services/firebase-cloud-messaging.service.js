"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseCloudMessagingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const admin = tslib_1.__importStar(require("firebase-admin"));
let FirebaseCloudMessagingService = class FirebaseCloudMessagingService {
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
    async subscribeToTopic(token, topic) {
        try {
            const response = await admin.messaging().subscribeToTopic(token, topic);
            console.log('Successfully subscribed to topic:', response);
        }
        catch (error) {
            throw new Error('Faild to subscribe topic: ', error);
        }
    }
    async subscribeMultipleToTopic(tokens, topic) {
        try {
            const response = await admin.messaging().subscribeToTopic(tokens, topic);
            console.log('Successfully subscribed multiple devices to topic:', response);
        }
        catch (error) {
            throw new Error('Faild to subscribe multiple devices to topic: ', error);
        }
    }
    async unsubscribeToTopic(token, topic) {
        try {
            const response = await admin
                .messaging()
                .unsubscribeFromTopic(token, topic);
            console.log('Successfully unsubscribed from topic:', response);
        }
        catch (error) {
            throw new Error('Failed to unsubscribe from topic: ' + error);
        }
    }
    async unsubscribeMultipleToTopic(tokens, topic) {
        try {
            const response = await admin
                .messaging()
                .unsubscribeFromTopic(tokens, topic);
            console.log('Successfully unsubscribed multiple devices from topic:', response);
        }
        catch (error) {
            throw new Error('Failed to unsubscribe multiple devices from topic: ' + error);
        }
    }
    async sendNotificationToTopic(topic, title, body, data) {
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            topic,
        };
        try {
            const response = await admin.messaging().send(message);
            console.log(`Successfully sent message to topic: ${response}`);
        }
        catch (error) {
            throw new Error('Faild to send message to topic: ', error);
        }
    }
    async sendNotificationToDevices(registrationTokens, title, body, data) {
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            tokens: registrationTokens,
        };
        try {
            for (const token of registrationTokens) {
                console.log(token);
            }
            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`Successfully sent message to devices: ${response.successCount} messages sent`);
            if (response.failureCount > 0) {
                console.error('Failed to send some messages:', response.responses.filter((r) => !r.success));
            }
        }
        catch (error) {
            throw new Error('Failed to send message to devices: ' + error);
        }
    }
};
exports.FirebaseCloudMessagingService = FirebaseCloudMessagingService;
exports.FirebaseCloudMessagingService = FirebaseCloudMessagingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], FirebaseCloudMessagingService);
//# sourceMappingURL=firebase-cloud-messaging.service.js.map