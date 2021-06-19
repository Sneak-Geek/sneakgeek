import React, {FC, useCallback, useState} from 'react';
import {StyleSheet, StyleProp, ViewStyle, Modal, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from 'store/AppStore';
import { Input } from 'react-native-elements';
import { Profile } from 'business/src';
import { BottomPicker } from 'screens/Shared/BottomPicker';
import { AppText, BottomButton, Header } from 'screens/Shared';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FactoryKeys, IAccountService, updateProfile } from 'business';
import { getDependency, getToken } from 'utilities';
import { showSuccessNotification } from 'actions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Icon} from 'react-native-elements';
import { strings, themes } from 'resources';
import { useNavigation } from '@react-navigation/core';

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        display: 'flex',
        flex: 1,

    },
    bottomButtonStyle:{
        backgroundColor: "#1E2330",
        borderRadius: 40,
        bottom: 10
    }
});

type AccountTabEditProfileProp = {
}

type AccountTabViewProfileState = {
    lastName: string;
    firstName: string;
    middleName: string;
    gender: string;
    shoeSize: string;
    email: string;
    phoneNumber: string;
    pickerType: PickerType;
    pickerVisible: boolean;
    updatedInfo?: Profile;
    addressModalVisible: boolean;
    addressLine1: string;
    addressLine2: string;
}

enum PickerType {
    GENDER,
    SHOE_SIZE,
    CITY,
    DISTRICT,
    WARD,
  }  


type SettingSection = {
    sectionName: string;
    sectionFields: Array<Setting>;
  };
  
  type Setting = {
    title: string;
    placeholder: string;
    isPicker?: boolean;
    pickerType?: PickerType;
    value: (profile: Profile) => string | number;
    options?: () => Array<string | number>;
    onUpdate?: (value: string, profile: Profile) => void;
    onPress?: () => void;
  };
  

export const AccountTabEditProfile: FC<AccountTabEditProfileProp> = (props: AccountTabEditProfileProp) => {
    const profile: Profile = useSelector((state: IAppState) => state?.UserState?.profileState?.profile);
    const [profileState, setProfileState] = useState<AccountTabViewProfileState>({
        lastName: profile?.userProvidedName?.lastName,
        firstName: profile?.userProvidedName?.firstName,
        middleName: profile?.userProvidedName?.middleName,
        gender: profile?.userProvidedGender,
        shoeSize: profile?.userProvidedShoeSize,
        email: profile?.userProvidedEmail,
        phoneNumber: profile?.userProvidedPhoneNumber,
        addressLine1: profile?.userProvidedAddress?.addressLine1,
        addressLine2: profile?.userProvidedAddress?.addressLine2,
        pickerType: undefined,
        pickerVisible: false,
        updatedInfo: Object.assign({}, profile),
        addressModalVisible: false
    });

    const navigation = useNavigation();

    const sectionList: Array<SettingSection>  = [
        {
          sectionName: '',
          sectionFields: [
            {
              title: 'Giới tính',
              placeholder: 'Giới tính',
              isPicker: true,
              pickerType: PickerType.GENDER,
              options: (): string[] => ['Nam', 'Nữ', 'Khác'],
              value: (profile: Profile): string => profile?.userProvidedGender,
            },
          ]
        },
      ];

      const dispatch = useDispatch();

      const showNotification = (value: string) => {dispatch(showSuccessNotification(value))};

      const _accountService = getDependency<IAccountService>(
        FactoryKeys.IAccountService,
      );

      const updateProfile = useCallback(async () => {
        try {
            const updatedProfile: Partial<Profile> = {
                userProvidedName: {
                    lastName: profileState.lastName,
                    firstName: profileState.firstName,
                    middleName: profileState.middleName
                },
                userProvidedGender: profileState.gender,
                userProvidedShoeSize: profileState.shoeSize,
                userProvidedEmail: profileState.email,
                userProvidedPhoneNumber: profileState.phoneNumber,
                userProvidedAddress: {
                    addressLine1: profileState.addressLine1,
                    addressLine2: profileState.addressLine2
                },
            };
            const res = await _accountService.updateProfile(
              getToken(),
              updatedProfile,
            );
            showNotification('Cập nhật thông tin cá nhân thành công');
            setProfileState({...profileState, ...updatedProfile});    
            navigation.goBack();
          } catch (error) {
            showNotification('Đã có lỗi khi xảy ra, xin vui lòng thử lại');
          }

      },[profileState.addressLine1, profileState.addressLine2, profileState.email, profileState.firstName, profileState.lastName, profileState.phoneNumber, profileState.gender]);
      
      const setting = sectionList
      .map((t) => t.sectionFields)
      .reduce((x, y) => x.concat(y))
      .find((t) => t.pickerType === profileState.pickerType);

    const components = [
        {
            id: 'lastName',
            type: 'TextInput',
            placeholder: '',
            value: profileState.lastName,
            label: 'Họ',
            onChangeText: (value: string) => {setProfileState({...profileState, lastName: value})},
            containerStyle: {}
        },
        {
            id: 'firstName',
            type: 'TextInput',
            placeholder: '',
            value: profileState.firstName,
            label: 'Tên',
            onChangeText: (value: string) => {setProfileState({...profileState, firstName: value})},
            containerStyle: {}
        },
        {
            id: 'gender',
            type: 'Picker',
            onPress: () =>  setProfileState({...profileState, pickerType: PickerType.GENDER, pickerVisible: true}),
            title: 'Giới tính',
            value: profileState.gender ?? undefined
        }
        ,
        {
            id: 'email',
            type: 'TextInput',
            placeholder: '',
            value: profileState.email,
            label: 'Email',
            onChangeText: (value: string) => {setProfileState({...profileState, email: value})},
            containerStyle: {}
        },
        {
            id: 'phoneNumber',
            type: 'TextInput',
            placeholder: '',
            value: profileState.phoneNumber,
            label: 'Số điện thoại',
            onChangeText: (value: string) => {setProfileState({...profileState, phoneNumber: value})},
            containerStyle: {}
        },
        {
            id: 'addressLine1',
            type: 'TextInputModal',
            placeholder: '',
            value: profileState.addressLine1,
            label: 'Địa chỉ 1',
            onChangeText: (value: string) => {setProfileState({...profileState, addressLine1: value})},
            containerStyle: {}
        },
        {
            id: 'addressLine2',
            type: 'TextInput',
            placeholder: '',
            value: profileState.addressLine2,
            label: 'Địa chỉ 2',
            onChangeText: (value: string) => {setProfileState({...profileState, addressLine2: value})},
            containerStyle: {}
        }
        
    ];
    
    return (
        <SafeAreaView style={styles.root}>
            <Header title={"Thông tin cá nhân"} topInset={2} leftIcon={true}></Header>
        <ScrollView style={{marginHorizontal: 20, flex: 1, marginTop: 34}}>
            {components.map((c) => {
                let content: JSX.Element = <></>;
                
                switch(c.type) {
                    case 'TextInput':
                        content = <SNKGKTextInput key={c.id} value={c.value} placeholder={c.placeholder} onChangeText={c.onChangeText} containerStyle={c.containerStyle} label={c.label}/>
                        break;
                    case 'Picker':
                        content =    <SNKGKPickerRow key={c.id} title={c.title} value={c.value} 
                        onPress={c.onPress}/>
                        break;
                    case 'TextInputModal':
                        content = 
                            <TouchableOpacity key={c.id} onPress={() => setProfileState({...profileState, addressModalVisible: true})}>

                                <SNKGKTextInput disabled={true}  value={c.value} placeholder={c.placeholder} onChangeText={c.onChangeText} containerStyle={c.containerStyle} label={c.label}/>
                            </TouchableOpacity>
                        break;
                }

                return content;
            })}
            {profileState.pickerVisible? <BottomPicker
                options={setting?.options?.()}
                visible={profileState.pickerVisible}
                onSelectPickerOK={(value: string): void => {
                    setProfileState({
                        ...profileState,
                        pickerVisible: false,
                        pickerType: undefined,
                        gender: value
                    });
                }}
                onSelectPickerCancel={(): void => {
                    setProfileState({...profileState, pickerVisible: false, pickerType: undefined});
                }
                }
                optionLabelToString={(t): string => t.toString()}
            /> : null}
         
        </ScrollView>
        <AddressModal addressModalVisible={profileState.addressModalVisible} iconOnPress={() => {setProfileState({...profileState, addressModalVisible: false})}} modalOnPress={(data) => {setProfileState({...profileState, addressLine1: data.description, addressModalVisible: false})}} onRequestClose={() => {setProfileState({...profileState, addressModalVisible: false})}}/>
            <BottomButton style={styles.bottomButtonStyle} title={'Xác nhận'} onPress={updateProfile}/>
        </SafeAreaView>
    );
}

type SNKGKTextInputProp = {
    label?: string;
    placeholder: string;
    onChangeText: (text:string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    value: string;
    disabled?: boolean;
}

const textInputStyles = StyleSheet.create({
    containerStyle: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginVertical: 0,
    },
    inputContainerStyle: {
        paddingVertical: 0,
        marginVertical: 0
    },
    labelStyle: {
        color: 'rgba(0,0,0,0.3)'
    }
});

const SNKGKTextInput: FC<SNKGKTextInputProp> = (props: SNKGKTextInputProp) => {
    const {label, placeholder, onChangeText, containerStyle, value, disabled} = props;
    return (
        <Input disabledInputStyle={{color: 'black', opacity: 1}} disabled={disabled} labelStyle={textInputStyles.labelStyle} value={value} onChangeText={onChangeText} inputContainerStyle={textInputStyles.inputContainerStyle} containerStyle={[textInputStyles.containerStyle, containerStyle]} label={label} placeholder={placeholder}/>
    );
}

type SNKGKPickerRowProp = {
    title: string;
    value: string;
    onPress?: () => void
};

const SNKGKPickerRow: FC<SNKGKPickerRowProp> = (props: SNKGKPickerRowProp) => {
    const {title, value, onPress} = props;
    return (
        <TouchableOpacity onPress={onPress} style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', marginBottom: 30}}>
            <AppText.Body>{title}</AppText.Body>
            <AppText.Body>{value}</AppText.Body>
        </TouchableOpacity>
    );
}

type AddressModalProp = {
    addressModalVisible: boolean;
    onRequestClose: () => void;
    iconOnPress: () => void;
    modalOnPress: (data: any) => void;
}

const AddressModal : FC<AddressModalProp> = (props: AddressModalProp) => {
    const {addressModalVisible, onRequestClose, iconOnPress, modalOnPress} = props;
    return (
        <Modal
        visible={addressModalVisible}
        hardwareAccelerated={true}
        animationType={'slide'}
        presentationStyle={'formSheet'}
        onRequestClose={onRequestClose}>
        <View style={{flex: 1, position: 'relative'}}>
          <Icon
            name={'close'}
            size={themes.IconSize * 1.5}
            onPress={iconOnPress}
            containerStyle={{position: 'absolute', right: 15, top: 15}}
          />
          <AppText.Title3 style={{margin: 20, marginTop: 30}}>
            Tìm kiếm địa chỉ
          </AppText.Title3>

          <GooglePlacesAutocomplete
            placeholder={strings.Address}
            textInputProps={{
              autoFocus: addressModalVisible,
            }}
            query={{
              key: 'AIzaSyDlfZb9snIlXHI-vn6zeaIAJfR3lWJmGlI',
              language: 'vi',
              components: 'country:vn',
            }}
            onPress={modalOnPress}
            styles={{
              textInput: themes.TextStyle.body,
              container: {flex: 1},
              description: themes.TextStyle.callout,
            }}
          />
        </View>
      </Modal>
    );
}


