export const Admin = {
  Credential: {
    email: "admin@sneakgeek.app",
    password: "longdeptrai",
  },
  Account: {
    _id: "5e92371b8289844955dd133f",
  },
};

export const User1 = {
  Credential: {
    email: "user1@gmail.com",
    password: "password",
  },
  Account: {
    _id: "5e9237535b10ce49bd09190f",
    accountProvider: "email",
    accountIdByProvider: "user1@gmail.com",
    accountEmailByProvider: "user1@gmail.com",
    profile: "5e9237535b10ce49bd091910",
    accessLevel: "User",
  },
  Profile: {
    _id: "5e9237535b10ce49bd091910",
    accountId: "5e9237535b10ce49bd09190f",
    shoeSizeStandard: "US",
    userProvidedName: {
      firstName: "Long",
      middleName: "Việt",
      lastName: "Nguyễn",
    },
    userProvidedAddress: {
      streetAddress: "1 Hoàng Minh Giám",
      ward: "Phường Trung Hòa",
      wardCode: "1A0607",
      district: "Quận Cầu Giấy",
      districtId: 1485,
      city: "Hà Nội",
    },
    userProvidedPhoneNumber: "0123456789",
  },
};

export const User2 = {
  Credential: {
    email: "user2@gmail.com",
    password: "password",
  },
  Account: {
    _id: "5e923774cc8c174a075aba67",
    accountProvider: "email",
    accountIdByProvider: "user2@gmail.com",
    accountEmailByProvider: "user2@gmail.com",
    profile: "5e923774cc8c174a075aba68",
    accessLevel: "User",
  },
  Profile: {
    _id: "5e923774cc8c174a075aba68",
    accountId: "5e923774cc8c174a075aba67",
    shoeSizeStandard: "US",
    userProvidedName: {
      firstName: "Đức",
      middleName: "Tiến",
      lastName: "Nguyễn",
    },
    userProvidedAddress: {
      streetAddress: "1 Trần Huy Liệu",
      ward: "Phường Giảng Võ",
      wardCode: "1A0104",
      district: "Quận Ba Đình",
      districtId: 1484,
      city: "Hà Nội",
    },
    userProvidedPhoneNumber: "0987654321",
  },
};

export const FacebookTestUser = {
  Token:
    "EAAVoFKRCRyYBALsDAW6HOMZC8heyi9M3gTwBO1kZA4GECwZB8DY2Or71bJHIZBt3xAgwekAgtLg8awhd6qT6xGkPnfskBZAmIJLBMOpHZAUgzR6xcq2zjubKvUKrZCOgfduM1wc61eR6drXOcZBoQfPDGPbjdtvWOmEm3IVRZCuoIhY91dnB257sT",
  Account: {
    isVerified: false,
    accountProvider: "facebook",
    accountNameByProvider: {
      familyName: "User",
      givenName: "Open",
      middleName: "Graph Test",
    },
    accountEmailByProvider: "open_jwizjdn_user@tfbnw.net",
  },
};
