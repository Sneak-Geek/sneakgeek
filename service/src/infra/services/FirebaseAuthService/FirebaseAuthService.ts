import { injectable } from "inversify";
import { EnvironmentProvider, LogProvider } from "../../providers";
import { IFirebaseAuthService } from "./IFirebaseAuthService";
import * as firebase from "firebase-admin";

@injectable()
export class FirebaseAuthService implements IFirebaseAuthService {
  constructor() {
    const serviceAccount = require(EnvironmentProvider.env.GoogleApplicationCredentials);
    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
  }

  public async getUserByUUID(uuid: string): Promise<firebase.auth.UserRecord> {
    let user: firebase.auth.UserRecord;
    try {
      user = await firebase.auth().getUser(uuid);
    } catch (error) {
      LogProvider.instance.error(error);
    }
    return user;
  }
}