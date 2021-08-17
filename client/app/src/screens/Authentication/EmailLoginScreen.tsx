import * as React from 'react';
import {Icon} from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {BottomButton, AppText, DismissKeyboardView} from 'screens/Shared';
import RouteNames from 'navigations/RouteNames';
import {connect} from 'utilities/ReduxUtilities';
import {authenticateWithEmail, NetworkRequestState, Profile} from 'business';
import {IAppState} from 'store/AppStore';
import {showErrorNotification, toggleIndicator} from 'actions';
import analytics from '@react-native-firebase/analytics';

type State = {
  email: string;
  password: string;
  showPassword: boolean;
  icon: string;
  errorEmail: string;
  errorPassword: string;
};

type StateProps = {
  profileState: {
    state: NetworkRequestState;
    error?: any;
    profile?: Profile;
  };
};

type DispatchProps = {
  toggleLoadingIndicator: (isLoading: boolean, message?: string) => void;
  showAppErrorNotification: (message: string) => void;
  emailLogin: (email: string, password: string) => void;
};

type Props = StateProps &
  DispatchProps & {
    navigation: StackNavigationProp<any>;
    route: any;
  };

@connect<StateProps, DispatchProps>(
  (state: IAppState) => {
    return {
      profileState: state.UserState.profileState,
    };
  },
  (dispatch: Function) => {
    return {
      toggleLoadingIndicator: (isLoading: boolean, message?: string) => {
        dispatch(toggleIndicator({isLoading, message}));
      },
      showAppErrorNotification: (message: string) => {
        dispatch(showErrorNotification(message));
      },
      emailLogin: (email: string, password: string) => {
        dispatch(authenticateWithEmail(email, password));
      },
    };
  },
)
export class EmailLoginScreen extends React.Component<Props, State> {
  state = {
    email: '',
    password: '',
    showPassword: true,
    icon: 'visibility-off',
    errorEmail: '',
    errorPassword: '',
  };

  componentDidMount() {
    if (this.props.route?.params?.email) {
      this.setState({ email: this.props.route.params.email });
    }
  }

  private showPassword = () => {
    let newState;
    if (this.state.showPassword) {
        newState = {
            icon: 'visibility',
            showPassword: false,
            email: this.state.email,
            password: this.state.password,
            errorEmail: this.state.errorEmail,
            errorPassword: this.state.errorPassword
        }
    } else {
        newState = {
            icon: 'visibility-off',
            showPassword: true,
            email: this.state.email,
            password: this.state.password,
            errorEmail: this.state.errorEmail,
            errorPassword: this.state.errorPassword
        }
    }
    // set new state value
    this.setState(newState)
  };

  public componentDidUpdate(prevProps: Props) {
    if (this.props.navigation.isFocused()) {
      const {navigation, profileState, toggleLoadingIndicator} = this.props;
      const {state} = profileState;
      if (state === prevProps.profileState.state) {
        return;
      }
      toggleLoadingIndicator(state === NetworkRequestState.REQUESTING);
      const currentError = this.props.profileState.error;

      if (state === NetworkRequestState.FAILED) {
          const message = currentError?.message;
          let newState;
          switch (message) {
            case 'auth/invalid-email':
              newState = {
                icon: this.state.icon,
                showPassword: this.state.showPassword,
                email: this.state.email,
                password: this.state.password,
                errorEmail: strings.InvalidEmail,
                errorPassword: ''
              }
              break;
            default:
              newState = {
                icon: this.state.icon,
                showPassword: this.state.showPassword,
                email: this.state.email,
                password: this.state.password,
                errorEmail: '',
                errorPassword: strings.InvalidLogin
              }
              break;
          }
          this.setState(newState);
      } else if (state === NetworkRequestState.SUCCESS) {
        analytics().logLogin({ method: 'email' });
        try {
            navigation.navigate(RouteNames.Order.Name, {
              screen: RouteNames.Order.BuyConfirmation,
            });
        } catch (error) {
          navigation.navigate(RouteNames.Tab.HomeTab.Name, {
            screen: RouteNames.Tab.HomeTab.Main,
          });
        }
      }
    }
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        <DismissKeyboardView style={styles.container}>
        <AppText.Body style={styles.bodyTextStyle}>
          {strings.WelcomeAndLogin}
        </AppText.Body>
        <AppText.Body style={styles.emailTextStyle}>
          Email:
        </AppText.Body>
          <View style={{flex: 1}}>
            <View style={{paddingHorizontal: 16}}>
              {this._renderEmail()}
              <Text style={{ color: 'red' }}>{this.state.errorEmail}</Text>
              <AppText.Body style={styles.passwordTextStyle}>
                Mật Khẩu:
              </AppText.Body>
              {this._renderPassword()}
              <Text style={{ color: 'red' }}>{this.state.errorPassword}</Text>
              {this._renderForgot()}
              </View>
          </View>
          {this._renderButton()}
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }

  private _renderEmail(): JSX.Element {
    const {email} = this.state;
    return (
      <View style={styles.inputContainer}>
        <TextInput
          testID={'EmailInput'}
          placeholderTextColor={themes.AppDisabledColor}
          autoFocus={true}
          style={styles.input}
          placeholder={strings.Email}
          value={email}
          onChangeText={(email) => this.setState({email})}
          selectionColor={themes.AppPrimaryColor}
          autoCapitalize={'none'}
        />
      </View>
    );
  }

  private _renderPassword() {
    const {password} = this.state;
    return (
      <View style={styles.inputContainer}>
        <TextInput
          testID={'PasswordInput'}
          style={styles.input}
          placeholderTextColor={themes.AppDisabledColor}
          placeholder={strings.Password}
          value={password}
          onChangeText={(password) => this.setState({password})}
          selectionColor={themes.AppPrimaryColor}
          secureTextEntry={this.state.showPassword}
          textContentType={'oneTimeCode'}
          autoCapitalize={'none'}
        />
        <Icon containerStyle={{position: 'absolute', right: 15, top: 15}}
              name={this.state.icon}
              size={themes.IconSize}
              color={this.state.showPassword ? themes.AppDisabledColor : themes.AppSecondaryColor}
              onPress={this.showPassword}
        />
      </View>
    );
  }

  private _renderForgot(): JSX.Element {
    const {navigation} = this.props;
    return (
      <AppText.Body
        style={styles.forgotContainer}
        onPress={() => navigation.navigate(RouteNames.Auth.ForgotPassword)}>
        {strings.ForgotPassword}
      </AppText.Body>
    );
  }

  private _renderButton(): JSX.Element {
    const {email, password} = this.state;

    return (
      <BottomButton
        testID={'LoginButton'}
        title={strings.SignIn}
        onPress={() => this.props.emailLogin(email, password)}
        style={{
          backgroundColor: (email && password) ? themes.AppSecondaryColor : themes.AppDisabledColor,
          borderRadius: themes.LargeBorderRadius,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
  },
  title: {
    lineHeight: 25,
    textAlign: 'left',
    paddingLeft: 42,
  },
  inputContainer: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginVertical: 5,
  },
  absolute: {
    position: 'absolute',
    left: 12,
    top: -7,
    backgroundColor: 'white',
  },
  input: {
    ...themes.TextStyle.callout,
    flex: 1,
  },
  bodyTextStyle: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 0,
  },
  emailTextStyle: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 37,
    marginBottom: 8,
  },
  passwordTextStyle: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  forgotContainer: {
    marginTop: 0,
    textAlign: 'left',
    marginLeft: 0,
    textDecorationLine: 'underline',
  },
});
