// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { NavigationScreenOptions } from "react-navigation";
import {
  ActionSheetIOS,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { Image } from "react-native-elements";
import ImagePicker, { ImagePickerResponse, ImagePickerOptions } from "react-native-image-picker";
import { Text } from "../../../Shared/UI";
import * as Assets from "../../../Assets";
import { Account, Profile } from "../../../Shared/Model";
import { NetworkRequestState } from "../../../Shared/State";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { TextStyle } from "../../../Shared/UI/Text";

export interface IUserTabMainProps {
  account: Account;
  profile: Profile;
  updateUserProfileState: NetworkRequestState;

  navigateToUserEdit: () => void;
  navigateToPayments: () => void;
  navigateToShoeSize: () => void;
  navigateToChangePassword: () => void;
  navigateToContactInfo: () => void;
  navigateToSearch: () => void;
  navigateToUserKind: () => void;
  navigateToNotiSetting: () => void;
  navigateToShare: () => void;
  updateProfilePic: (image: ImagePickerResponse) => void;
  logout: () => void;
}

interface IUserListOption {
  title: string;
  hasMarginBottom: boolean;
  onClick: () => void;
}

export default class TabUserMainScreen extends React.Component<IUserTabMainProps> {
  public static navigationOptions: NavigationScreenOptions = {
    title: "Trang cá nhân",
    headerTitleStyle: TextStyle.title3
  };

  private optionsList: IUserListOption[] = [
    {
      title: "Thông tin cá nhân",
      hasMarginBottom: true,
      onClick: () => this.props.navigateToUserEdit()
    },
    {
      title: "Đổi mật khẩu",
      hasMarginBottom: true,
      onClick: () => this.props.navigateToChangePassword()
    },
    {
      title: "Số dư tài khoản",
      hasMarginBottom: false,
      onClick: () => this.props.navigateToPayments()
    },
    {
      title: "Tuỳ chỉnh thông tin giày",
      hasMarginBottom: true,
      onClick: () => this.props.navigateToUserKind()
    },
    {
      title: "Tiêu chuẩn size",
      hasMarginBottom: false,
      onClick: () => this.props.navigateToShoeSize()
    },
    {
      title: "Cài đặt thông báo",
      hasMarginBottom: true,
      onClick: () => this.props.navigateToNotiSetting()
    },
    {
      title: "Chia sẻ ứng dụng",
      hasMarginBottom: false,
      onClick: () => this.props.navigateToShare()
    },
    {
      title: "Thông tin về SneakGeek",
      hasMarginBottom: false,
      onClick: () => this.props.navigateToSearch()
    },
    {
      title: "Liên hệ",
      hasMarginBottom: true,
      onClick: () => this.props.navigateToContactInfo()
    }
  ];

  private readonly imagePickerOptions: ImagePickerOptions = {
    title: "Upload profile picture",
    storageOptions: {
      skipBackup: true,
      path: "images"
    },
    quality: 0.5
  };

  public constructor /** override */(props: any) {
    super(props);
    this.state = {};
  }

  public /** override */ render(): React.ReactNode {
    return (
      <SafeAreaView>
        {this._renderUpdateStatus()}
        <StatusBar barStyle={"dark-content"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {this._renderBasicUserData()}
            {this._renderSettingsList()}
            {this._renderLogoutButton()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  private _renderUpdateStatus() {
    if (this.props.updateUserProfileState === NetworkRequestState.REQUESTING) {
      return (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0,0, 0.4)",
            zIndex: 1000,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      );
    }

    return null;
  }

  private _renderBasicUserData(): JSX.Element {
    const { profile, account } = this.props;

    const firstName = account.accountNameByProvider?.givenName || profile.userProvidedName?.firstName;
    const lastName = account.accountNameByProvider?.familyName || profile.userProvidedName?.lastName;
    const emptyName = typeof firstName === "undefined" || typeof lastName === "undefined";

    const imgSrcUrl = account.accountProfilePicByProvider || profile.userProvidedProfilePic;
    const imgSrc = imgSrcUrl ? { uri: imgSrcUrl } : Assets.Icons.DefaultProfile;

    return (
      <View style={styles.headerContainer}>
        <View style={{ position: "relative" }}>
          <Image source={imgSrc} style={styles.avatarContainer} />
          <TouchableOpacity style={styles.cameraButtonContainer} onPress={() => this._uploadProfilePicture()}>
            <Image source={Assets.Icons.ProfileCamera} style={{ width: 22, height: 18 }} />
          </TouchableOpacity>
        </View>
        <View>
          {!emptyName && <Text.Headline style={styles.name}>{`${firstName} ${lastName}`}</Text.Headline>}
          {/* <Text.Callout style={styles.address}>Hà Nội, VN</Text.Callout> */}
        </View>
      </View>
    );
  }

  private _renderSettingsList(): React.ReactNode {
    return <View>{this.optionsList.map(this._renderOptionItem.bind(this))}</View>;
  }

  private _renderOptionItem(item: IUserListOption) {
    return (
      <TouchableWithoutFeedback onPress={item.onClick.bind(this)}>
        <View
          key={item.title}
          style={[item.hasMarginBottom ? styles.listItemStyleWithMarginBottom : null, styles.settingsContainer]}
        >
          <Text.Callout style={{ fontWeight: "bold", fontSize: 16, opacity: 0.6 }}>
            {item.title.toUpperCase()}
          </Text.Callout>
          <Image source={Assets.Icons.ChevronLeft} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  private _renderLogoutButton(): React.ReactNode {
    return (
      <TouchableOpacity onPress={() => this.props.logout()} style={[styles.settingsContainer, styles.signOutContainer]}>
        <Text.Body style={{ color: "white" }}>Đăng xuất</Text.Body>
      </TouchableOpacity>
    );
  }

  private _uploadProfilePicture() {
    const options = [
      {
        title: "Chọn ảnh từ thư viện",
        onPress: this._onSelectPhoto.bind(this),
        isCancel: false
      },
      { title: "Chụp ảnh mới", onPress: this._onTakePhoto.bind(this), isCancel: false },
      {
        title: "Huỷ",
        onPress: () => {
          return;
        },
        isCancel: true
      }
    ];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options.map(t => t.title),
        cancelButtonIndex: options.findIndex(t => t.isCancel)
      },
      index => options[index].onPress()
    );
  }

  private _onSelectPhoto() {
    ImagePicker.launchImageLibrary(this.imagePickerOptions, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.error) {
        this.props.updateProfilePic(response);
      }
    });
  }

  private _onTakePhoto() {
    ImagePicker.launchCamera(this.imagePickerOptions, response => {
      if (!response.didCancel && !response.error) {
        this.props.updateProfilePic(response);
      }
    });
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    margin: 30,
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  title: {
    marginVertical: 50,
    fontSize: 24
  },

  cameraButtonContainer: {
    position: "absolute",
    bottom: -10,
    right: 0,
    backgroundColor: "lightgrey",
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },

  avatarContainer: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 65
  },

  name: {
    marginTop: 25,
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "right",
    paddingBottom: 9
  },

  address: {
    fontSize: 14,
    fontFamily: "RobotoCondensed-Bold",
    opacity: 0.4,
    textAlign: "right"
  },

  contentContainer: {
    marginVertical: 50
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

  listItemStyleWithMarginBottom: {
    marginBottom: 20
  },

  logoutText: {
    fontSize: 16,
    color: "red"
  },

  logoutButton: {
    backgroundColor: "rgba(196,196,196, 0.1)",
    height: Assets.Styles.ButtonHeight,
    marginBottom: 30
  },

  settingsContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Assets.Styles.ListItemBackgroundColor,
    height: Assets.Styles.ButtonHeight
  },

  signOutContainer: {
    backgroundColor: Assets.Styles.AppErrorColor,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  }
});
