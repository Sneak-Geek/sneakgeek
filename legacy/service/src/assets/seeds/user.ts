import { hashSync } from "bcrypt";
import { saltRounds } from "../constants";
import { AccessLevel, UserAccount, UserProfile } from "../../infra/database";

export const AdminCredential = {
  email: "sneakgeek.test+admin@gmail.com",
  password: "sneakgeek",
};

export const AdminAccount = {
  accountProvider: "email",
  accountIdByProvider: AdminCredential.email,
  accountEmailByProvider: AdminCredential.email,
  password: hashSync(AdminCredential.password, saltRounds),
  accessLevel: AccessLevel.Admin,
  isVerified: true,
};

export type SeedCredential = {
  email: string;
  password: string;
};

export const AdminProfile = {
  userProvidedName: {
    firstName: "Đại",
    middleName: "Quang",
    lastName: "Trần",
  },
  userProvidedAddress: {
    addressLine1: "14c Ngô Thì Nhậm, Phường Hàng Bài, 1A0206, Quận Hoàn Kiếm, Hà Nội",
    addressLine2: "Ngách 12/8",
  },
  userProvidedPhoneNumber: "0947356248",
  isSeller: true,
  userProvidedEmail: AdminCredential.email,
};

export const UserCredential = {
  email: "sneakgeek.test+user@gmail.com",
  password: "sneakgeek",
};

export const UserRegularAccount: Partial<UserAccount> = {
  accountProvider: "email",
  accountIdByProvider: UserCredential.email,
  accountEmailByProvider: UserCredential.email,
  password: hashSync(UserCredential.password, saltRounds),
  accessLevel: AccessLevel.User,
  isVerified: true,
};

export const UserRegularProfile = {
  userProvidedName: {
    firstName: "Hoang",
    middleName: "Huy",
    lastName: "Pham",
  },
  userProvidedAddress: {
    addressLine1: "12 Chùa Bộc, Quận Đống Đa, Hà Nội",
    addressLine2: "424 G2",
  },
  userProvidedPhoneNumber: "0912738809",
  isSeller: false,
  userProvidedEmail: UserCredential.email,
};

export const SellerCredential = {
  email: "sneakgeek.test+seller@gmail.com",
  password: "password",
};

export const SellerAccount = {
  accountProvider: "email",
  accountIdByProvider: SellerCredential.email,
  accountEmailByProvider: SellerCredential.email,
  password: hashSync(SellerCredential.password, saltRounds),
  accessLevel: AccessLevel.Seller,
  isVerified: true,
};

export const SellerProfile = {
  userProvidedName: {
    firstName: "Hoang",
    middleName: "Huy",
    lastName: "Pham",
  },
  userProvidedAddress: {
    addressLine1: "12 Chùa Bộc, Quận Đống Đa, Hà Nội",
    addressLine2: "424 G2",
  },
  userProvidedPhoneNumber: "0912738809",
  isSeller: true,
  userProvidedEmail: SellerCredential.email,
};
