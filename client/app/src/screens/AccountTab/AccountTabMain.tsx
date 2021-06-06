import React from 'react';
import {SafeAreaView, StatusBar, View, StyleSheet, Alert} from 'react-native';
import {connect} from 'utilities/ReduxUtilities';
import {IAppState} from 'store/AppStore';
import {
  Profile,
  Account,
  FactoryKeys,
  updateProfile,
  ObjectFactory,
  ISettingsProvider,
} from 'business';
import {themes, strings} from 'resources';
import {AppText} from 'screens/Shared';
import {Icon, ListItem} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {
  toggleIndicator,
  showSuccessNotification,
  showErrorNotification,
  reset,
} from 'actions';

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
      title: strings.AppContact,
      onClick: (): void =>
        this.props.navigation.push(RouteNames.Tab.AccountTab.ContactUs),
      leftIcon: 'phone',
    },
  ];

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

  private _isUserLoggedIn() {
    const {account, profile} = this.props;
    return Boolean(account && profile);
  }

  private _isSeller() {
    return Boolean(this._isUserLoggedIn() && this.props.profile.isSeller);
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
    return this.settings.map((setting) => (
      <ListItem
        key={setting.title}
        bottomDivider={true}
        onPress={setting.onClick}>
        <Icon name={setting.leftIcon} color={themes.AppPrimaryColor} />
        <ListItem.Content>
          <ListItem.Title style={themes.TextStyle.body}>
            {setting.title}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    ));
  }

  private _renderBottomActionButton(): JSX.Element {
    const isAccountAvailable = Boolean(
      this.props.account && this.props.profile,
    );
    const title = isAccountAvailable ? strings.LogOut : strings.SignIn;
    const iconTitle = isAccountAvailable ? 'logout' : 'login';
    return (
      <ListItem
        key={title}
        bottomDivider={true}
        onPress={this._bottomButtonHandler.bind(this, isAccountAvailable)}>
        <Icon
          name={iconTitle}
          color={themes.AppPrimaryColor}
          type={'material-community'}
        />
        <ListItem.Content>
          <ListItem.Title style={themes.TextStyle.body}>{title}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
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
}