export enum AccessLevel {
  User = "User",
  Partner = "Partner",
  Authenticator = "Authenticator",
  Content = "Content",
  Manager = "Manager",
  Admin = "Admin",
  Seller = "Seller",
}

type Profile = {
  _id: string;
  id: string;
  firebaseAccountId: string;
  accessLevel: AccessLevel;
  createdAt: string;
  updatedAt: string;
  userProvidedName: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
  userProvidedEmail: string;
  userProvidedGender: string;
  userProvidedPhoneNumber: string;
};

export default Profile;
