import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  StatusBar
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {BottomButton, DismissKeyboardView, AppText} from 'screens/Shared';
import RouteNames from 'navigations/RouteNames';
import {connect} from 'utilities/ReduxUtilities';
import {NetworkRequestState, Profile, verifyEmail} from 'business';
import {IAppState} from 'store/AppStore';
import {showErrorNotification, toggleIndicator} from 'actions';

type State = {
  email: string;
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
  verifyEmail: (email: string) => void;
};

type Props = StateProps &
  DispatchProps & {
    navigation: StackNavigationProp<any>;
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
      verifyEmail: (email: string) => {
        dispatch(verifyEmail(email));
      },
    };
  },
)
export class EmailVerifyScreen extends React.Component<Props, State> {
  state = {
    email: '',
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
        switch (message) {
          case 'Has Signin Method':
            navigation.navigate(RouteNames.Auth.Name, {
              screen: RouteNames.Auth.EmailLogin,
            });
            break;
          default:
            navigation.navigate(RouteNames.Auth.Name, {
              screen: RouteNames.Auth.EmailSignUp,
            });
            break;
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
          {strings.PleaseEnterEmail}
        </AppText.Body>
        <AppText.Body style={styles.emailTextStyle}>
          Email:
        </AppText.Body>
          <View style={{flex: 1}}>
            <View style={{paddingHorizontal: 16}}>
              {this._renderEmail()}
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

  private _renderButton(): JSX.Element {
    const {email} = this.state;

    return (
      <BottomButton
        testID={'VerifyButton'}
        title={strings.Continue}
        onPress={() => this.props.verifyEmail(email)}
        style={{
          backgroundColor: (email) ? themes.AppSecondaryColor : themes.AppDisabledColor,
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
