import { injectable } from "inversify";
import { EnvironmentProvider } from "../../providers";
import { IFirebaseAuthService } from "./IFirebaseAuthService";

@injectable()
export class FirebaseAuthService implements IFirebaseAuthService {
    private admin;
    private serviceAccount;

    constructor() {
        this.admin = require("firebase-admin");
        this.serviceAccount = require(EnvironmentProvider.env.GoogleApplicationCredentials);
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.serviceAccount)
          });
    }

    



}