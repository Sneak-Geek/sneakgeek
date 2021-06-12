import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import { useSelector } from 'react-redux';
import { IAppState } from 'store/AppStore';
import { Input } from 'react-native-elements';
import { Profile } from 'business/src';

type AccountTabEditProfileProp = {
}

type AccountTabViewProfileState = {
    lastName: string;
    firstName: string;
    gender: string;
    shoeSize: string;
    email: string;
    phoneNumber: string;
}

export const AccountTabEditProfile: FC<AccountTabEditProfileProp> = (props: AccountTabEditProfileProp) => {
    const profile: Profile = useSelector((state: IAppState) => state?.UserState?.profileState?.profile);
    const [profileState, setProfileState] = useState<AccountTabViewProfileState>({
        lastName: profile?.userProvidedName?.lastName,
        firstName: profile?.userProvidedName?.firstName,
        gender: profile?.userProvidedGender,
        shoeSize: profile?.userProvidedShoeSize,
        email: profile?.userProvidedEmail,
        phoneNumber: profile?.userProvidedPhoneNumber
    });

    // const components = [
    //     {
    //         type: 'TextInput',
    //         label:
    //     }
    // ];
    
    return (
        <View>
        </View>
    );
}

type SNKGKTextInputProp = {
    label?: string;
    placeholder: string;
    onChangeText: (text:string) => void;
    containerStyle?: StyleProp<ViewStyle>;
}

const textInputStyles = StyleSheet.create({
    containerStyle: {

    }
});

const SNKGKTextInput: FC<SNKGKTextInputProp> = (props: SNKGKTextInputProp) => {
    const {label, placeholder, onChangeText, containerStyle} = props;
    return (
        <Input onChangeText={onChangeText} containerStyle={[textInputStyles.containerStyle, containerStyle]} label={label} placeholder={placeholder}/>
    );
}