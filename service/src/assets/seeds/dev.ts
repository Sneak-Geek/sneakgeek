import { AccessLevel, UserProfile } from "../../infra/database";

export type FirebaseUser = Partial<UserProfile> & { password: string };

export const AdminFbProfile: FirebaseUser = {
  userProvidedEmail: "sneakgeek.test+admin@gmail.com",
  password: "password",
  accessLevel: AccessLevel.Admin,
  userProvidedName: {
    firstName: "Đại",
    middleName: "Quang",
    lastName: "Trần",
  },
  userProvidedAddress: {
    addressLine1: "14c Ngô Thì Nhậm, Phường Hàng Bài, 1A0206, Quận Hoàn Kiếm, Hà Nội",
    addressLine2: "Ngách 12/8",
  },
};

export const UserFbProfile: FirebaseUser = {
  userProvidedEmail: "sneakgeek.test+user@gmail.com",
  password: "password",
  accessLevel: AccessLevel.User,
  userProvidedName: {
    firstName: "Hoang",
    middleName: "Huy",
    lastName: "Pham",
  },
  userProvidedAddress: {
    addressLine1: "12 Chùa Bộc, Quận Đống Đa, Hà Nội",
    addressLine2: "424 G2",
  },
};

export const SellerFbProfile: FirebaseUser = {
  userProvidedEmail: "sneakgeek.test+seller@gmail.com",
  password: "password",
  accessLevel: AccessLevel.Seller,
  userProvidedName: {
    firstName: "Nguyễn",
    middleName: "Tiến",
    lastName: "Đức",
  },
  userProvidedAddress: {
    addressLine1: "1 Hoàng Minh Giám, Cầu Giấy, Hà Nội",
    addressLine2: "12 Lý 1",
  },
};
