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
    streetAddress: "14c Ngô Thì Nhậm",
    ward: "Phường Hàng Bài",
    wardCode: "1A0206",
    district: "Quận Hoàn Kiếm",
    districtId: 1489,
    city: "Hà Nội",
  },
  userProvidedPhoneNumber: "0947356248",
};
