import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  StatusBar,
  Alert,
  Text,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {BottomButton, AppText, DismissKeyboardView} from 'screens/Shared';
import {connect} from 'utilities/ReduxUtilities';
import {authenticateWithEmail, NetworkRequestState, Profile} from 'business';
import {IAppState} from 'store/AppStore';
import {showErrorNotification, toggleIndicator} from 'actions';
import RouteNames from 'navigations/RouteNames';
import {Icon} from 'react-native-elements';

type State = {
  email: string;
  password: string;
  showPassword: boolean;
  icon: string;
  errorEmail: string;
  errorPassword: string;
};

type Props = {
  profileState: {
    state: NetworkRequestState;
    error?: any;
    profile?: Profile;
  };
  navigation: StackNavigationProp<any>;

  toggleLoadingIndicator: (isLoading: boolean, message?: string) => void;
  showErrorNotification: (message: string) => void;
  emailSignUp: (email: string, password: string) => void;
};

@connect(
  (state: IAppState) => ({
    profileState: state.UserState.profileState,
  }),
  (dispatch: Function) => ({
    toggleLoadingIndicator: (isLoading: boolean, message?: string): void => {
      dispatch(toggleIndicator({isLoading, message}));
    },
    showErrorNotification: (message: string): void => {
      dispatch(showErrorNotification(message));
    },
    emailSignUp: (email: string, password: string): void => {
      dispatch(authenticateWithEmail(email, password, true));
    },
  }),
)
export class EmailSignUpScreen extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: true,
      icon: 'visibility-off',
      errorEmail: '',
      errorPassword: '',
    };
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

  public componentDidUpdate(prevProps: Props): void {
    if (this.props.navigation.isFocused()) {
      const {
        profileState,
        showErrorNotification,
        toggleLoadingIndicator,
      } = this.props;
      const {state} = profileState;
      if (state === prevProps.profileState.state) {
        return;
      }

      if (profileState.state === NetworkRequestState.SUCCESS &&
        profileState.profile
      ) {
        this.props.navigation.push(RouteNames.Tab.Name);
      }

      toggleLoadingIndicator(state === NetworkRequestState.REQUESTING);

      const currentError = this.props.profileState.error;
      const message = currentError?.message;
          let newState;
          switch (message) {
            case '[auth/invalid-email] The email address is badly formatted.':
              newState = {
                icon: this.state.icon,
                showPassword: this.state.showPassword,
                email: this.state.email,
                password: this.state.password,
                errorEmail: strings.InvalidEmail,
                errorPassword: ''
              }
              break;
            case '[auth/email-already-in-use] The email address is already in use by another account.':
              newState = {
                icon: this.state.icon,
                showPassword: this.state.showPassword,
                email: this.state.email,
                password: this.state.password,
                errorEmail: strings.EmailRegisteredVN,
                errorPassword: ''
              }
              break;
            case undefined:
            case '':
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
    }
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        <DismissKeyboardView style={styles.container}>
        <AppText.Body style={styles.bodyTextStyle}>
          {strings.WelcomeAndSignup}
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
              {this._renderTermsOfService()}
              </View>
          </View>
          {this._renderSignUpButton()}
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }

  private _renderEmail(): JSX.Element {
    const {email} = this.state;
    return (
      <View style={styles.inputContainer}>
        <TextInput
          testID={'EmailSignUpInput'}
          autoFocus={true}
          style={styles.input}
          placeholderTextColor={themes.AppDisabledColor}
          placeholder={strings.Email}
          value={email}
          onChangeText={(email) => this.setState({email})}
          selectionColor={themes.AppPrimaryColor}
          autoCapitalize={'none'}
        />
      </View>
    );
  }

  private _renderPassword(): JSX.Element {
    const {password} = this.state;
    return (
      <View style={styles.inputContainer}>
        <TextInput
          testID={'EmailSignUpPasswordInput'}
          style={styles.input}
          placeholder={strings.Password}
          placeholderTextColor={themes.AppDisabledColor}
          value={password}
          onChangeText={(password): void => this.setState({password})}
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

  private _renderTermsOfService(): JSX.Element {
    // TODO: Browser webview to show terms of service
    return (
      <AppText.Body style={styles.forgotContainer}>
        {`${strings.TermsOfServiceAgreement}`}
        <AppText.Body
          style={{textDecorationLine: 'underline'}}
          onPress={() => null}>
          {`${strings.ViewTermsOfServiceAgreement}`}
        </AppText.Body>
      </AppText.Body>
    );
  }

  private _renderSignUpButton(): JSX.Element {
    const {email, password} = this.state;

    return (
      <BottomButton
        testID={'ConfirmSignUpButton'}
        title={strings.SignUp}
        onPress={() => this.props.emailSignUp(email, password)}
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
  forgotContainer: {
    marginTop: 25,
    textAlign: 'center',
  },
});
