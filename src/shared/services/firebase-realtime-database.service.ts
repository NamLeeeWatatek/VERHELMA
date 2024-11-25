/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';

import { UserEntity } from '../../modules/user/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class FirebaseFirestoreService {
  private firestore: any;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../../vermelha-88923-firebase-adminsdk-dz0c7-e4e3f671f9.json',
    );

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }

    this.firestore = admin.firestore();
  }

    @Cron('*/5 * * * *') // Every 5 minutes
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
    //console.log('Data synchronized to Firestore successfully');
  }

  async syncNewUserToFirebase(user: UserEntity) {
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
    // console.log('Synchronized new user to Firestore successfully');
  }
}
