import { hashSync } from "bcrypt";
import { AccessLevel } from "../../infra/database";
import { saltRounds } from "../constants";

export const HeatFactoryCredential = {
  email: "sneakgeek.test+heatfactory@gmail.com",
  password: "sneakgeek",
};

export const HeatFactoryAccount = {
  accountProvider: "email",
  accountIdByProvider: HeatFactoryCredential.email,
  accountEmailByProvider: HeatFactoryCredential.email,
  password: hashSync(HeatFactoryCredential.password, saltRounds),
  accessLevel: AccessLevel.Seller,
  isVerified: true,
};

export const HeatFactoryProfile = {
  userProvidedName: {
    firstName: "Heat Factory",
    middlename: "",
    lastName: "",
  },
  userProvidedAddress: {
    addressLine1: "34A Trần Quốc Toản, Hàng Bài, Hoàn Kiếm, Hà Nội",
    addressLine2: "",
  },
  userProvidedPhoneNumber: "+84369312377",
  isSeller: true,
  userProvidedEmail: HeatFactoryCredential.email,
};

export const LuckyStarCredential = {
  email: "sneakgeek.test+luckystar@gmail.com",
  password: "sneakgeek",
};

export const LuckyStarAccount = {
  accountProvider: "email",
  accountIdByProvider: HeatFactoryCredential.email,
  accountEmailByProvider: HeatFactoryCredential.email,
  password: hashSync(HeatFactoryCredential.password, saltRounds),
  accessLevel: AccessLevel.Seller,
  isVerified: true,
};

export const LuckystarProfile = {
  userProvidedName: {
    firstName: "LuckyStar",
    middlename: "",
    lastName: "",
  },
  userProvidedAddress: {
    addressLine1: "447 Bạch Mai, Đống Đa, Hà Nội",
    addressLine2: "",
  },
  userProvidedPhoneNumber: "+84949651358",
  isSeller: true,
  userProvidedEmail: HeatFactoryCredential.email,
};
