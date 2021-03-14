export type UserAddress = {
    addressLine1: string,
    addressLine2: string
};

export type UserBankAccount = {
    accountNumber: string,
    bankBranch: string,
}

export interface Profile {
    _id: string;
    isSeller: boolean;
    accountId: string;
    favoriteShoes: string[];
    ownedShoes: Array<{
        shoeId: string;
        owned: Array<{ number: number; shoeSize: string }>;
    }>;
    userProvidedName?: {
        firstName: string;
        middleName: string;
        lastName: string;
    };
    userProvidedBankAccount?: UserBankAccount;
    userProvidedAddress?: UserAddress;
    userProvidedGender?: string;
    userProvidedShoeSize?: string;
    userProvidedEmail?: string;
    userProvidedPhoneNumber?: string;
    userProvidedProfilePic?: string;
}