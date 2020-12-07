import React from 'react';
import {SafeAreaView, StatusBar, View, StyleSheet, Alert} from 'react-native';
import {connect} from 'utilities/ReduxUtilities';
import {IAppState} from 'store/AppStore';
import {
  Profile,
  Account,
  ICdnService,
  FactoryKeys,
  updateProfile,
  IAccountService,
  ObjectFactory,
  ISettingsProvider,
} from 'business';
import {themes, strings} from 'resources';
import {AppText, BottomButton} from 'screens/Shared';
import {ListItem, Avatar} from 'react-native-elements';
import ImagePicker, {ImagePickerOptions} from 'react-native-image-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {getDependency, getToken} from 'utilities';
import {
  toggleIndicator,
  showSuccessNotification,
  showErrorNotification,
  reset,
} from 'actions';
import ActionSheet from 'react-native-action-sheet';

type Props = {
  account: Account;
  profile: Profile;
  navigation: StackNavigationProp<any>;
  toggleLoading: (isLoading: boolean) => void;
  showNotification: (message: string, isError?: boolean) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  logout: () => void;
};

type Setting = {
  title: string;
  onClick: () => void;
  leftIcon: string;
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: themes.AppDisabledColor,
  },
  avatarContainer: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  name: {
    marginTop: 25,
    textAlign: 'right',
  },
});

@connect(
  (state: IAppState) => ({
    account: state.UserState.accountState.account,
    profile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean): void => {
      dispatch(toggleIndicator({isLoading, message: strings.PleaseWait}));
    },
    showNotification: (message: string, isError = false): void => {
      if (!isError) {
        dispatch(showSuccessNotification(message));
      } else {
        dispatch(showErrorNotification(message));
      }
    },
    updateProfile: (profile: Profile): void => {
      dispatch(updateProfile(profile));
    },
    logout: (): void => {
      dispatch(reset());
    },
  }),
)
export class AccountTabMain extends React.Component<Props> {
  private settings: Setting[] = [
    {
      title: strings.AccountInfo,
      onClick: (): void =>
        this._onClickWithAccountGuarded(() =>
          this.props.navigation.push(RouteNames.Tab.AccountTab.EditProfile),
        ),
      leftIcon: 'person',
    },
    {
      title: strings.PaymentInfo,
      onClick: (): void =>
      this._onClickWithAccountGuarded(() => 
        this.props.navigation.push(RouteNames.Tab.AccountTab.PaymentInfo)
      ),
      leftIcon: 'account-balance'
    },
    {
      title: strings.NotificationSettings,
      onClick: (): void => null,
      leftIcon: 'notifications-active',
    },
    {
      title: strings.ShareApplication,
      onClick: (): void => null,
      leftIcon: 'share',
    },
    {
      title: strings.InfoAppSetting,
      onClick: (): void => {
        this._onClickWithAccountGuarded(() =>
          this.props.navigation.push(RouteNames.Tab.AccountTab.Faq),
        );
      },
      leftIcon: 'info',
    },
    {
      title: strings.AppContact,
      onClick: (): void => null,
      leftIcon: 'phone',
    },
  ];
  private imagePickerOption: ImagePickerOptions = {
    allowsEditing: true,
    mediaType: 'photo',
    quality: 0.5,
  };

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{backgroundColor: themes.AppAccentColor, flex: 1}}>
        <StatusBar barStyle={'dark-content'} />
        <View style={{flex: 1, position: 'relative'}}>
          {this._renderBasicUserData()}
          {this._renderSettingsList()}
          {this._renderBottomActionButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _onClickWithAccountGuarded(action: () => void) {
    const {account, profile, navigation} = this.props;
    const isAccountExist = Boolean(account && profile);
    if (isAccountExist) {
      return action();
    }

    Alert.alert(strings.PleaseLogin, strings.NoAccountPleastLogin, [
      {
        text: strings.SignIn,
        onPress: () => {
          navigation.navigate(RouteNames.Auth.Name, {
            screen: RouteNames.Auth.Login,
          });
        },
      },
      {
        text: strings.Cancel,
        onPress: null,
        style: 'cancel',
      },
    ]);
  }

  private _renderBasicUserData(): JSX.Element {
    const {account, profile} = this.props;
    const firstName = profile?.userProvidedName?.firstName;
    const lastName = profile?.userProvidedName?.lastName;

    // check name
    const name = `${firstName} ${lastName}` || undefined;

    // check avatar
    const avatarUri =
      profile?.userProvidedProfilePic || account?.accountProfilePicByProvider;
    const avatar = avatarUri
      ? {source: {uri: avatarUri}}
      : {icon: {name: 'person'}};

    return (
      <View style={styles.headerContainer}>
        <Avatar
          {...avatar}
          rounded={true}
          size={'large'}
          containerStyle={styles.avatarContainer}
          onPress={this._takePicture.bind(this)}
        />
        {!name && (
          <AppText.Headline style={styles.name}>
            {`${firstName} ${lastName}`}
          </AppText.Headline>
        )}
      </View>
    );
  }

  private _renderSettingsList(): JSX.Element[] {
    return this.settings.map((setting) => (
      <ListItem
        key={setting.title}
        chevron={true}
        title={setting.title}
        bottomDivider={true}
        titleStyle={themes.TextStyle.body}
        leftIcon={{name: setting.leftIcon, color: themes.AppPrimaryColor}}
        onPress={setting.onClick}
      />
    ));
  }

  private _renderBottomActionButton(): JSX.Element {
    const isAccountAvailable = Boolean(
      this.props.account && this.props.profile,
    );
    const title = isAccountAvailable ? strings.LogOut : strings.SignIn;
    const backgroundColor = isAccountAvailable
      ? themes.AppPrimaryColor
      : themes.AppErrorColor;
    return (
      <BottomButton
        title={title}
        onPress={this._bottomButtonHandler.bind(this, isAccountAvailable)}
        style={{backgroundColor}}
      />
    );
  }

  private _bottomButtonHandler(isAccountAvailable: boolean = true): void {
    this.props.navigation.navigate(RouteNames.Auth.Name, {
      screen: RouteNames.Auth.Login,
    });
    if (isAccountAvailable) {
      const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
        FactoryKeys.ISettingsProvider,
      );
      settings.clear();
      this.props.logout();
    }
  }

  private _takePicture(): void {
    const options = [
      {
        name: strings.ChoosePictureLocal,
        action: (): Promise<void> => this._choosePictureLocal(),
      },
      {
        name: strings.TakePicture,
        action: (): Promise<void> => this._takeCameraPhoto(),
      },
      {name: strings.Cancel, action: (): void => null},
    ];

    ActionSheet.showActionSheetWithOptions(
      {
        options: options.map((t) => t.name),
        cancelButtonIndex: 2,
        destructiveButtonIndex: -1,
      },
      (btnIdx) => options[btnIdx].action(),
    );
  }

  private async _takeCameraPhoto(): Promise<void> {
    ImagePicker.launchCamera(this.imagePickerOption, (result) => {
      if (!result.didCancel && !result.error) {
        this._uploadProfileImage({
          uri: result.uri,
          type: result.type,
        });
      }
    });
  }

  private async _choosePictureLocal(): Promise<void> {
    await ImagePicker.launchImageLibrary(this.imagePickerOption, (result) => {
      if (!result.didCancel && !result.error) {
        this._uploadProfileImage({
          uri: result.uri,
          type: result.type,
        });
      }
    });
  }

  private async _uploadProfileImage(image: {
    uri: string;
    type: string;
  }): Promise<void> {
    const cdnService = getDependency<ICdnService>(FactoryKeys.ICdnService);
    const accountService = getDependency<IAccountService>(
      FactoryKeys.IAccountService,
    );

    this.props.toggleLoading(true);
    try {
      const [url] = await cdnService.uploadImages(getToken(), [image]);

      const profile = await accountService.updateProfile(getToken(), {
        userProvidedProfilePic: url,
      });

      this.props.updateProfile(profile);
      this.props.showNotification(strings.PaymentSuccess);
    } catch (error) {
      this.props.showNotification(strings.ErrorPleaseTryAgain, true);
      console.warn(error);
      console.log(JSON.stringify(error, null, 2));
    } finally {
      this.props.toggleLoading(false);
    }
  }
}
