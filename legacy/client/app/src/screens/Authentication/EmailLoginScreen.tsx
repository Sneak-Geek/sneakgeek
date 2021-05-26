import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {BottomButton, AppText, DismissKeyboardView} from 'screens/Shared';
import RouteNames from 'navigations/RouteNames';
import {connect} from 'utilities/ReduxUtilities';
import {authenticateWithEmail, NetworkRequestState, Account} from 'business';
import {IAppState} from 'store/AppStore';
import {showErrorNotification, toggleIndicator} from 'actions';

type State = {
  email: string;
  password: string;
};

type StateProps = {
  accountState: {
    state: NetworkRequestState;
    error?: any;
    account?: Account;
  };
};

type DispatchProps = {
  toggleLoadingIndicator: (isLoading: boolean, message?: string) => void;
  showAppErrorNotification: (message: string) => void;
  emailLogin: (email: string, password: string) => void;
};

type Props = StateProps &
  DispatchProps & {
    navigation?: StackNavigationProp<any>;
  };

@connect<StateProps, DispatchProps>(
  (state: IAppState) => {
    return {
      accountState: state.UserState.accountState,
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
  };

  public componentDidUpdate(prevProps: Props) {
    if (this.props.navigation.isFocused()) {
      const {navigation, accountState, toggleLoadingIndicator} = this.props;
      const {state} = accountState;
      if (state === prevProps.accountState.state) {
        return;
      }
      toggleLoadingIndicator(state === NetworkRequestState.REQUESTING);
      const currentError = this.props.accountState.error;

      if (state === NetworkRequestState.FAILED) {
        const provider = currentError?.response?.data?.provider;
        switch (provider) {
          case strings.GoogleString:
            Alert.alert(strings.AccountCreatedByGoogle);
            break;
          case strings.FacebookString:
            Alert.alert(strings.AccountCreatedByFacebook);
            break;
          case strings.EmailString:
            Alert.alert(strings.AccountCreatedByEmail);
            break;
          case undefined:
            Alert.alert(strings.InvalidLogin);
            break;
          default:
            break;
        }
      } else if (state === NetworkRequestState.SUCCESS) {
        navigation.push(RouteNames.Tab.Name);
      }
    }
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        <DismissKeyboardView style={styles.container}>
          <View style={{flex: 1}}>
            <View style={{paddingHorizontal: 40}}>
              {this._renderEmail()}
              {this._renderPassword()}
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
          style={styles.input}
          placeholderTextColor={themes.AppDisabledColor}
          placeholder={strings.Password}
          value={password}
          onChangeText={(password) => this.setState({password})}
          selectionColor={themes.AppPrimaryColor}
          secureTextEntry={true}
          autoCapitalize={'none'}
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
        title={strings.SignIn}
        onPress={() => this.props.emailLogin(email, password)}
        style={{
          backgroundColor: themes.AppPrimaryColor,
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
  forgotContainer: {
    marginTop: 25,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
