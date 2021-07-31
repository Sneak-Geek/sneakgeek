type AuthProvider = 'facebook' | 'google' | 'apple';

type Account = {
  _id: string;
  id: string;
  isVerified: boolean;
  accessLevel: number;
  profile: string;
  createdAt: string;
  updatedAt: string;
  accountProvider: AuthProvider;
  accountIdByProvider: string;
  accountNameByProvider: {
    familyName: string;
    givenName: string;
    middleName: string;
  };
  accountGenderByProvider: string;
  accountEmailByProvider: string;
  accountProfilePicByProvider: string;
};

export default Account;
