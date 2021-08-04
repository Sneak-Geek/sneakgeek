import * as firebase from "firebase-admin";

export interface IFirebaseAuthService {
  getUserByUUID(uuid: string): Promise<firebase.auth.UserRecord>;
}
