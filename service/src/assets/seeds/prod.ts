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

export const AdminProdProfile: FirebaseUser = {
  userProvidedEmail: "admin@sneakgeek.io",
  password: "sneakgeek",
  accessLevel: AccessLevel.Admin,
  userProvidedName: {
    firstName: "Trần",
    middleName: "Quang",
    lastName: "Đại",
  },
};
