import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class AuthService {
  async verifyTokenForUid(idToken: string) {
    const result = await admin.auth().verifyIdToken(idToken);
    return result.uid;
  }
}
