export type UserAddress = {
    addressLine1: string,
    addressLine2: string
};

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
    userProvidedAddress?: UserAddress;
    userProvidedGender?: string;
    userProvidedShoeSize?: string;
    userProvidedEmail?: string;
    userProvidedPhoneNumber?: string;
    userProvidedProfilePic?: string;
}