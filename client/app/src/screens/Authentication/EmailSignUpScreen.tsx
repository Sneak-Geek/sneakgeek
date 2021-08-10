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
import {connect} from 'utilities/ReduxUtilities';
import {authenticateWithEmail, NetworkRequestState, Profile} from 'business';
import {IAppState} from 'store/AppStore';
import {showErrorNotification, toggleIndicator} from 'actions';
import RouteNames from 'navigations/RouteNames';

type State = {
  email: string;
  password: string;
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
    };
  }

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

      if (
        profileState.state === NetworkRequestState.SUCCESS &&
        profileState.profile
      ) {
        this.props.navigation.push(RouteNames.Tab.Name);
      }

      toggleLoadingIndicator(state === NetworkRequestState.REQUESTING);

      const errorMessage = profileState.error?.response?.data?.message;
      switch (errorMessage) {
        case strings.EmailRegisteredEng:
          Alert.alert(strings.EmailRegisteredVN);
          break;
        case undefined:
        case '':
          break;
        default:
          showErrorNotification(strings.InvalidLogin);
          break;
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
          secureTextEntry={true}
          textContentType={'oneTimeCode'}
          autoCapitalize={'none'}
        />
      </View>
    );
  }

  private _renderTermsOfService(): JSX.Element {
    // TODO: Browser webview to show terms of service
    return (
      <AppText.Body style={styles.forgotContainer}>
        {`${strings.TermsOfServiceAgreement}. `}
        <AppText.Body
          style={{textDecorationLine: 'underline'}}
          onPress={() => null}>
          {`${strings.SeeMore}`}
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
  },
});
