import { injectable } from "inversify";
import { EnvironmentProvider, LogProvider } from "../../providers";
import { IFirebaseAuthService } from "./IFirebaseAuthService";
import * as firebase from "firebase-admin";

const serviceAccount = require(EnvironmentProvider.env.GoogleApplicationCredentials);

@injectable()
export class FirebaseAuthService implements IFirebaseAuthService {
  constructor() {
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
