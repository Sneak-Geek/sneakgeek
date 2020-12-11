import { hashSync } from "bcrypt";
import { saltRounds } from "../constants";
import { AccessLevel } from "../../infra/database";

export const AdminCredential = {
  email: "admin@sneakgeek.app",
  password: "longdeptrai",
};

export const AdminAccount = {
  accountProvider: "email",
  accountIdByProvider: AdminCredential.email,
  accountEmailByProvider: AdminCredential.email,
  password: hashSync(AdminCredential.password, saltRounds),
  accessLevel: AccessLevel.Admin,
  isVerified: true,
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
};
