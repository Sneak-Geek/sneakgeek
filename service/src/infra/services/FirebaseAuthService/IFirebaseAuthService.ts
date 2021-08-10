import * as firebase from "firebase-admin";

export interface IFirebaseAuthService {
  getUserByUUID(uuid: string): Promise<firebase.auth.UserRecord>;
  verifyIdToken(idToken: string): Promise<firebase.auth.DecodedIdToken>;
  deleteTestUser(): Promise<void>;
  createVerifiedUserWithEmailAndPassword(
    email: string,
    pass: string
  ): Promise<firebase.auth.UserRecord>;
}
