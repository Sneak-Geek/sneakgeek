import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {strings, themes, images} from 'resources';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {connect} from 'utilities/ReduxUtilities';
import {
  authenticateWithFb,
  NetworkRequestState,
  authenticateWithApple,
} from 'business';
import {IAppState} from 'store/AppStore';
import {FeatureFlags} from 'FeatureFlag';
import {toggleIndicator} from 'actions';
import { Profile } from 'business';

type Props = {
  profileState: {profile?: Profile, error?: any, state: NetworkRequestState};
  navigation: StackNavigationProp<any>;
  toggleLoading: (isLoading: boolean) => void;
  facebookLogin: () => void;
  appleLogin: () => void;
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  button: {
    borderRadius: themes.LoginButtonBorderRadius,
    height: themes.RegularButtonHeight,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: themes.AppSecondaryColor,
    borderWidth: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleStyle: {
    color: 'white',
    ...themes.TextStyle.callout,
  },
  iconStyle: {
    width: themes.IconSize,
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  logo: {
    width: 350,
    height: 350,
    tintColor: themes.AppAccentColor,
  },
  emailIconStyle: {
    width: themes.IconSize,
    height: themes.IconSize - 4,
    marginLeft: 10,
    marginRight: 20,
  },
  emailLoginStyle: {
    marginTop: 10,
    textAlign: 'center',
    color: 'black',
  },
});

@connect(
  (state: IAppState) => ({
    profileState: state.UserState.profileState,
  }),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean): void => {
      dispatch(toggleIndicator({isLoading, message: ''}));
    },
    facebookLogin: (): void => {
      dispatch(authenticateWithFb());
    },
    appleLogin: (): void => {
      dispatch(authenticateWithApple());
    },
  }),
)
export class LoginScreen extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <ImageBackground source={images.Home} style={{flex: 1}} testID={'LoginScreen'}>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar barStyle={'light-content'} />
          {!this.props.profileState.profile && (
            <View style={{flex: 1, alignItems: 'center', marginBottom: 10}}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}>
                <Icon
                  name={'close'}
                  size={themes.IconSize * 2}
                  color={'white'}
                  onPress={() => this.props.navigation.goBack()}
                  containerStyle={{backgroundColor: 'transparent'}}
                />
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                {FeatureFlags.enableFacebook && this._renderFacebookLogin()}
                {Platform.OS === 'ios' && this._renderAppleLogin()}
                {this._renderEmailVerify()}
              </View>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  private _renderFacebookLogin(): JSX.Element {
    return (
      <Button
        type={'solid'}
        title={strings.ContinueFacebook}
        icon={<Image source={images.Facebook} style={styles.iconStyle} />}
        titleStyle={styles.titleStyle}
        buttonStyle={{
          backgroundColor: themes.FacebookThemeColor,
          ...styles.button,
        }}
        onPress={this.props.facebookLogin.bind(this)}
      />
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.navigation.isFocused()) {
      const {profileState, navigation} = this.props;
      const currentError = profileState.error;
      const prevError = prevProps.profileState.error;

      if (profileState.state === NetworkRequestState.REQUESTING) {
        this.props.toggleLoading(true);
      }

      if (
        profileState.state === NetworkRequestState.SUCCESS &&
        profileState.profile
      ) {
        this.props.toggleLoading(false);
        navigation.push(RouteNames.Tab.Name);
      }

      if (currentError && currentError !== prevError) {
        this.props.toggleLoading(false);
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
          default:
            break;
        }
      }
    }
  }

  private _renderAppleLogin() {
    return (
      <Button
        type={'outline'}
        buttonStyle={[{backgroundColor: 'white'}, styles.button]}
        title={strings.ContinueApple}
        icon={<Image source={images.Apple} style={styles.iconStyle} />}
        titleStyle={{...styles.titleStyle, color: 'black'}}
        onPress={this.props.appleLogin.bind(this)}
      />
    );
  }

  private _renderEmailVerify() {
    return (
      <Button
        testID={'EmailVerifyButton'}
        type={'outline'}
        buttonStyle={{
          backgroundColor: themes.AppPrimaryColor,
          ...styles.button,
        }}
        title={strings.SignUpEmail}
        icon={<Image source={images.Email} style={styles.emailIconStyle} />}
        titleStyle={styles.titleStyle}
        onPress={() => this.props.navigation.push(RouteNames.Auth.EmailVerify)}
      />
    );
  }
}
