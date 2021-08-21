import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {connect} from 'utilities/ReduxUtilities';
import {IAppState} from 'store/AppStore';
import {
  Profile,
  FactoryKeys,
  updateProfile,
  ObjectFactory,
  ISettingsProvider,
} from 'business';
import {themes, strings, images} from 'resources';
import {AppText, BottomButton} from 'screens/Shared';
import {Icon, ListItem} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {
  toggleIndicator,
  showSuccessNotification,
  showErrorNotification,
  reset,
} from 'actions';
import {firebase} from '@react-native-firebase/auth';

type Props = {
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
  visible?: boolean;
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  logInButtonContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 128,
    borderRadius: 8,
    backgroundColor: themes.AppSecondaryColor,
    paddingTop: 24,
    marginBottom: 16,
  },
  logInButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themes.AppPrimaryColor,
    width: 153,
    height: 52,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 16,
  },
  logInTextStyle: {
    color: 'white',
  },
});

@connect(
  (state: IAppState) => ({
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
      firebase.auth().signOut();
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
          this.props.navigation.push(RouteNames.Tab.AccountTab.ViewProfile),
        ),
      leftIcon: 'person',
      visible: Boolean(this.props.profile),
    },
    {
      title: strings.AppContact,
      onClick: (): void =>
        this.props.navigation.push(RouteNames.Tab.AccountTab.ContactUs),
      leftIcon: 'phone',
      visible: true,
    },
  ];

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{backgroundColor: themes.AppAccentColor, flex: 1}}>
        {this._renderLogInButton()}
        <View style={{flex: 1, position: 'relative'}}>
          {this._renderBasicUserData()}
          {this._renderSettingsList()}
          {this._renderBottomActionButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _isUserLoggedIn() {
    const {profile} = this.props;
    return Boolean(profile);
  }

  private _onClickWithAccountGuarded(action: () => void) {
    if (this._isUserLoggedIn()) {
      return action();
    }
    Alert.alert(strings.PleaseLogin, strings.NoAccountPleastLogin, [
      {
        text: strings.SignIn,
        onPress: () => {
          this.props.navigation.navigate(RouteNames.Auth.Name, {
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
    const {profile} = this.props;
    const firstName = profile?.userProvidedName?.firstName;
    const lastName = profile?.userProvidedName?.lastName;

    // check name
    const name = `${firstName} ${lastName}` || undefined;
    return (
      <View style={styles.headerContainer}>
        {!name && (
          <AppText.Headline style={styles.name}>
            {`${firstName} ${lastName}`}
          </AppText.Headline>
        )}
      </View>
    );
  }

  private _renderSettingsList(): JSX.Element[] {
    return this.settings.map((setting) => {
      return setting?.visible ? (
        <ListItem
          containerStyle={{backgroundColor: '#F4F4F5'}}
          key={setting.title}
          onPress={setting.onClick}>
          <Icon name={setting.leftIcon} color={themes.AppSecondaryColor} />
          <ListItem.Content>
            <ListItem.Title style={themes.TextStyle.body}>
              {setting.title}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ) : (
        <View></View>
      );
    });
  }

  private _renderBottomActionButton(): JSX.Element {
    if (!Boolean(this.props.profile)) return <></>;
    const title = strings.LogOut;
    const iconTitle = 'logout';
    return (
      <ListItem
        style={{
          position: 'absolute',
          bottom: 43,
          width: Dimensions.get('screen').width,
        }}
        key={title}
        onPress={this._bottomButtonHandler.bind(this)}>
        <Icon
          name={iconTitle}
          color={themes.AppPrimaryColor}
          type={'material-community'}
        />
        <ListItem.Content>
          <ListItem.Title
            style={[
              themes.TextStyle.headline,
              {color: themes.AppPrimaryColor, position: 'absolute'},
            ]}>
            {title.toUpperCase()}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  }

  private _bottomButtonHandler(): void {
    this.props.navigation.navigate(RouteNames.Auth.Name, {
      screen: RouteNames.Auth.Login,
    });

    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider,
    );
    settings.clear();
    this.props.logout();
  }

  private _renderLogInButton(): JSX.Element {
    const isAccountAvailable = Boolean(this.props.profile);
    const LoggedIn: JSX.Element = (
      <View
        style={{
          height: 128,
          borderRadius: 8,
          backgroundColor: themes.AppSecondaryColor,
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        <AppText.Headline style={{color: 'white', fontSize: 24}}>
          {strings.WelcomeToSneakGeek}
        </AppText.Headline>
        <Image source={images.AvatarWhite} style={{width: 66, height: 66}} />
      </View>
    );
    const NotLoggedIn: JSX.Element = (
      <View style={styles.logInButtonContainerStyle}>
        <AppText.Body style={styles.logInTextStyle}>
          Đăng nhập để giao dịch trên SneakGeek
        </AppText.Body>
        <TouchableOpacity
          style={styles.logInButtonStyle}
          onPress={() => {
            this.props.navigation.navigate(RouteNames.Auth.Name, {
              screen: RouteNames.Auth.Login,
            });
          }}>
          <AppText.Body style={[styles.logInTextStyle, {fontWeight: '700'}]}>
            {strings.SignIn.toUpperCase()}
          </AppText.Body>
        </TouchableOpacity>
      </View>
    );

    return <>{isAccountAvailable ? LoggedIn : NotLoggedIn}</>;
  }
}
