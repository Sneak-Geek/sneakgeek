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

export const FakeSellerProfile: FirebaseUser = {
  userProvidedEmail: "sneakgeek.test+fakeprodseller@gmail.com",
  password: "password",
  accessLevel: AccessLevel.Seller,
  //@ts-ignore
  userProvidedName: {
    firstName: "Test",
    lastName: "Seller",
  },
};

export const FakeBuyerProfile: FirebaseUser = {
  userProvidedEmail: "sneakgeek.test+fakeprodbuyer@gmail.com",
  password: "password",
  accessLevel: AccessLevel.User,
  //@ts-ignore
  userProvidedName: {
    firstName: "Test",
    lastName: "Buyer",
  },
  userProvidedAddress: {
    addressLine1: "Ngách 12/2, 12 Chùa Bộc, Đống Đa, Hà Nội",
    addressLine2: "424 G2",
  },
};
