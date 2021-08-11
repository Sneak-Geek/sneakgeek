import { AccessLevel } from "../../infra/database";
import { FirebaseUser } from "./dev";

export const THCFbProfile: FirebaseUser = {
  userProvidedEmail: "dehype.duco@gmail.com",
  password: "dehype123",
  accessLevel: AccessLevel.Seller,
  //@ts-ignore
  userProvidedName: {
    firstName: "The Hype Collector",
  },
};
