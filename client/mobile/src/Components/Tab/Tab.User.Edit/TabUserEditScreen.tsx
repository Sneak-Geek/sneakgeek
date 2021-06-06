//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { ScrollView, StackActions, NavigationScreenProp, NavigationRoute, BottomTabBarProps } from "react-navigation";
import { View, StyleSheet, TextInput, SafeAreaView } from "react-native";
import { Text } from "../../../Shared/UI";
import { Icon } from "react-native-elements";
import { Profile } from "../../../Shared/Model";
import * as Assets from "../../../Assets";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NetworkRequestState } from "../../../Shared/State";
import KeyboardSpacer from "react-native-keyboard-spacer";

const optionsList = [
  {
    title: "Họ",
    placeholder: "Họ",
    value: (profile: Profile) => (profile.userProvidedName ? profile.userProvidedName.lastName : ""),
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedName: {
          ...profile.userProvidedName,
          lastName: value
        }
      });
    },
    hasMarginBottom: false
  },
  {
    title: "Tên",
    placeholder: "Tên",
    value: (profile: Profile) => (profile.userProvidedName ? profile.userProvidedName.firstName : ""),
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedName: {
          ...profile.userProvidedName,
          firstName: value
        }
      });
    },
    hasMarginBottom: true
  },
  {
    title: "Địa chỉ",
    placeholder: "Địa chỉ",
    value: (profile: Profile) => profile.userProvidedAddress ?? "",
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedAddress: value
      });
    },
    hasMarginBottom: true
  },
  {
    title: "Giới tính",
    placeholder: "Giới tính",
    value: (profile: Profile) => profile.userProvidedGender,
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedGender: value
      });
    },
    hasMarginBottom: false
  },
  {
    title: "Cỡ giày",
    placeholder: "Cỡ giày",
    value: (profile: Profile) => profile.userProvidedShoeSize,
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedShoeSize: value
      });
    },
    hasMarginBottom: true
  },
  {
    title: "Email",
    email: "Email",
    value: (profile: Profile) => profile.userProvidedEmail,
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedEmail: value
      });
    },
    hasMarginBottom: false
  },
  {
    title: "Số Điện thoại",
    placeholder: "Số Điện thoại",
    value: (profile: Profile) => profile.userProvidedPhoneNumber,
    onUpdate: (value: string, profile: Profile) => {
      return Object.assign(profile, {
        userProvidedPhoneNumber: value
      });
    },
    hasMarginBottom: true
  }
];

export interface IUserEditScreenProps {
  profile?: Profile;
  updateProfileState: { state: NetworkRequestState };
  navigation?: NavigationScreenProp<NavigationRoute>;
  updateProfile: (data: Partial<Profile>) => void;
}

export interface IUserEditState {
  editMode: boolean;
  updatedInfo?: Profile;
}

export class TabUserEditScreen extends React.Component<IUserEditScreenProps, IUserEditState> {
  public static navigationOptions = (navigationConfig: BottomTabBarProps) => ({
    title: "Thông tin cá nhân",
    headerTitleStyle: Text.TextStyle.headline,
    headerLeft: (
      <Icon
        name={"ios-arrow-back"}
        type={"ionicon"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => navigationConfig.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    )
  });

  public constructor /** override */(props: IUserEditScreenProps) {
    super(props);
    this.state = {
      editMode: false,
      updatedInfo: this.props.profile
    };
  }

  public /** override */ render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>{this._renderSettings()}</ScrollView>
        {Assets.Device.IS_IOS && (
          <KeyboardSpacer topSpacing={Assets.Device.isIphoneX ? -Assets.Device.bottomSpace : 0} />
        )}
        {this._renderUpdateButton()}
      </SafeAreaView>
    );
  }

  public /** override */ shouldComponentUpdate(prevProps: IUserEditScreenProps) {
    if (
      prevProps.updateProfileState.state !== this.props.updateProfileState.state &&
      this.props.updateProfileState.state === NetworkRequestState.SUCCESS
    ) {
      this.setState({ editMode: false });
    }
    return true;
  }

  private _renderSettings() {
    const { updatedInfo } = this.state;
    return (
      <View style={{ paddingTop: 34 }}>
        {optionsList.map((item, i) => (
          <View key={i} style={[styles.listItem, item.hasMarginBottom ? styles.listItemStyleWithMarginBottom : {}]}>
            <Text.Headline style={{ flex: 1 }}>{item.title.toUpperCase()}</Text.Headline>
            <TextInput
              value={updatedInfo && item.value(updatedInfo) ? (item.value(updatedInfo) as any).toString() : ""}
              placeholder={item.placeholder}
              onChangeText={value => {
                if (updatedInfo) {
                  const newProfile = item.onUpdate(value, updatedInfo);
                  this.setState({ updatedInfo: newProfile, editMode: true });
                }
              }}
              style={styles.input}
            />
          </View>
        ))}
      </View>
    );
  }

  private _renderUpdateButton(): JSX.Element | null {
    if (!this.state.editMode) {
      return null;
    }

    return (
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            const newProfile = this.state.updatedInfo as Profile;
            this.props.updateProfile(newProfile);
          }}
        >
          <Text.Body style={{ color: Assets.Styles.TextSecondaryColor }}>Xác nhận</Text.Body>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 20,
    alignItems: "center"
  },

  title: {
    marginVertical: 50,
    fontSize: 24
  },

  avatarContainer: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 100
  },

  contentContainer: {
    marginVertical: 100
  },

  passwordContainer: {
    marginVertical: 50
  },

  addressContainer: {
    marginVertical: 50
  },

  infoButton: {
    backgroundColor: "#E5E5E5",
    color: "#FFFFFF"
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold"
  },

  listItem: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "rgba(196,196,196, 0.1)",
    alignItems: "center",
    justifyContent: "flex-start",
    height: Assets.Styles.ButtonHeight
  },

  listItemStyleWithMarginBottom: {
    marginBottom: 50
  },

  logoutText: {
    fontSize: 16,
    color: "red"
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Assets.Styles.ButtonHeight,
    backgroundColor: Assets.Styles.ButtonPrimaryColor,
    alignItems: "center",
    justifyContent: "center"
  },

  input: {
    fontSize: 17,
    color: Assets.Styles.AppPrimaryColor,
    flex: 2,
    fontFamily: "RobotoCondensed-Regular"
  }
});
