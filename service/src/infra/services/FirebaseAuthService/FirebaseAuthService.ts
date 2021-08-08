import { injectable } from "inversify";
import { LogProvider } from "../../providers";
import { IFirebaseAuthService } from "./IFirebaseAuthService";
import * as firebase from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

@injectable()
export class FirebaseAuthService implements IFirebaseAuthService {
  private readonly firebaseSvcLocation = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;

  constructor() {
    const rawSvc = fs.readFileSync(
      path.join(process.cwd(), "resources", "firebase", this.firebaseSvcLocation),
      { encoding: "utf8" }
    );
    const serviceAccount = JSON.parse(rawSvc);
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

  public verifyIdToken(idToken: string): Promise<firebase.auth.DecodedIdToken> {
    return firebase.auth().verifyIdToken(idToken);
  }
}
