import React from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';
import {strings, themes} from 'resources';
import {getDependency, isValidEmail, isValidPassword} from 'utilities';
import {IAccountService} from 'business/src';
import {FactoryKeys} from 'business';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {AppText, BottomButton, WrongInputError} from 'screens/Shared';

type Props = {
  navigation?: StackNavigationProp<any>;
};

enum Status {
  ERROR,
  SUCCESS,
}

enum ScreenType {
  EMAIL_SCREEN,
  PASSCODE_SCREEN,
  PASSWORD_SCREEN,
}

type State = {
  currentScreen: ScreenType;
  currentScreenStatus: Status;
  email: string;
  passcode: string;
  password: string;
  reenteredPassWord: string;
  inputError: string;
};

type ForgotPasswordComponents = {
  render: () => JSX.Element;
  canProceed: () => boolean;
};

const styles = StyleSheet.create({
  input: {
    ...themes.TextStyle.callout,
    paddingLeft: 15,
    flex: 1,
  },
  bodyInfoContainer: {
    paddingTop: 30,
    width: Dimensions.get('screen').width,
    paddingHorizontal: 40,
  },
  emailContainer: {
    height: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginBottom: 17,
  },
  bodyContainer: {
    flex: 1,
  },
  textStyle: {
    height: 52,
    lineHeight: 25,
    marginBottom: 17,
  },
  incorrectEmailStyle: {
    ...themes.TextStyle.callout,
    paddingLeft: 15,
    flex: 1,
  },
  bottomButtonStyle: {
    backgroundColor: themes.AppPrimaryColor,
    position: 'absolute',
    marginBottom: 35,
  },
});

export class ForgotPasswordScreen extends React.Component<Props, State> {
  private readonly _accountService = getDependency<IAccountService>(
    FactoryKeys.IAccountService,
  );
  private _childFlatList: FlatList<ForgotPasswordComponents>;
  private childComponents: ForgotPasswordComponents[];

  constructor(props: Props) {
    super(props);
    this.state = {
      currentScreenStatus: Status.ERROR,
      currentScreen: 0,
      email: '',
      passcode: '',
      password: '',
      reenteredPassWord: '',
      inputError: undefined,
    };
    this.childComponents = [
      {
        render: (): JSX.Element => {
          return this._renderChildComponent(
            strings.FillInEmail,
            undefined,
            strings.EmailStringCap,
          );
        },
        canProceed: (): boolean => {
          return Boolean(isValidEmail(this.state.email));
        },
      },
      {
        render: (): JSX.Element => {
          return this._renderChildComponent(
            strings.ForgotPasswordTokenVerification,
            strings.FillInPasscode,
            strings.Passcode,
          );
        },
        canProceed: (): boolean => {
          return true;
        },
      },
      {
        render: (): JSX.Element => {
          return this._renderChildComponent(
            strings.FillInPassword,
            undefined,
            strings.Password,
            strings.ReenterPassword,
          );
        },
        canProceed: (): boolean => {
          return Boolean(
            this.state.password === this.state.reenteredPassWord &&
              isValidPassword(this.state.password, 1),
          );
        },
      },
    ];
  }

  render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.bodyContainer}>
          {this._renderForgotPasswordContents()}
        </View>
        {this._renderBottomButton(strings.Continue)}
      </SafeAreaView>
    );
  }

  private _renderForgotPasswordContents(): JSX.Element {
    return (
      <FlatList
        ref={(ref) => (this._childFlatList = ref)}
        bounces={false}
        style={{marginTop: 10, height: '100%'}}
        horizontal={true}
        pagingEnabled={true}
        data={this.childComponents}
        renderItem={({item}) => item.render()}
        alwaysBounceHorizontal={false}
        scrollEnabled={false}
        keyExtractor={(_item, idx) => idx.toString()}
      />
    );
  }

  private _renderChildComponent(
    firstComponentRenderer: string = ' ',
    secondComponentRenderer: string = undefined,
    thirdComponentRenderer: string = undefined,
    fourthComponentRenderer: string = undefined,
  ): JSX.Element {
    return (
      <View style={styles.bodyInfoContainer}>
        {firstComponentRenderer && (
          <AppText.Body style={styles.textStyle}>
            {firstComponentRenderer}
          </AppText.Body>
        )}
        {secondComponentRenderer && (
          <AppText.Body style={styles.textStyle}>
            {secondComponentRenderer}
          </AppText.Body>
        )}
        {thirdComponentRenderer &&
          this._renderInputPlaceHolder(thirdComponentRenderer)}
        {fourthComponentRenderer &&
          this._renderInputPlaceHolder(fourthComponentRenderer)}
      </View>
    );
  }

  private _renderInputPlaceHolder(inputType: string): JSX.Element {
    switch (inputType) {
      case strings.EmailStringCap:
        return (
          <View>
            <View style={styles.emailContainer}>
              <TextInput
                autoFocus={true}
                style={
                  this.childComponents[this.state.currentScreen].canProceed()
                    ? styles.input
                    : styles.incorrectEmailStyle
                }
                placeholderTextColor={themes.AppDisabledColor}
                placeholder={strings.Email}
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}
                selectionColor={themes.AppSecondaryColor}
                autoCapitalize={'none'}
              />
            </View>
            {this._renderInputError(this.state.inputError)}
          </View>
        );

      case strings.Passcode:
        return (
          <View>
            <View style={styles.emailContainer}>
              <TextInput
                autoFocus={true}
                style={styles.input}
                placeholderTextColor={themes.AppDisabledColor}
                placeholder={strings.Passcode}
                value={this.state.passcode}
                onChangeText={(passcode) => this.setState({passcode})}
                selectionColor={themes.AppSecondaryColor}
                autoCapitalize={'none'}
              />
            </View>
            {this._renderInputError(this.state.inputError)}
          </View>
        );
      case strings.Password:
        return (
          <View>
            <View style={styles.emailContainer}>
              <TextInput
                autoFocus={true}
                style={styles.input}
                secureTextEntry={true}
                placeholder={strings.Password}
                placeholderTextColor={themes.AppDisabledColor}
                value={this.state.password}
                onChangeText={(password) => this.setState({password})}
                selectionColor={themes.AppSecondaryColor}
                autoCapitalize={'none'}
              />
            </View>
            {this.state.inputError === strings.InvalidPasswordErrorType1 &&
              this._renderInputError(this.state.inputError)}
          </View>
        );
      case strings.ReenterPassword:
        return (
          <View>
            <View style={styles.emailContainer}>
              <TextInput
                autoFocus={true}
                style={styles.input}
                placeholder={strings.ReenterPassword}
                secureTextEntry={true}
                value={this.state.reenteredPassWord}
                onChangeText={(reenteredPassWord) =>
                  this.setState({reenteredPassWord})
                }
                selectionColor={themes.AppSecondaryColor}
                autoCapitalize={'none'}
              />
            </View>
            {this.state.inputError === strings.UnmatchedPasswords &&
              this._renderInputError(this.state.inputError)}
          </View>
        );
      default:
        break;
    }
  }

  private _renderBottomButton(title: string) {
    return (
      <BottomButton
        title={title}
        style={styles.bottomButtonStyle}
        onPress={this._handleContinueButton.bind(this)}
      />
    );
  }

  private async _handleContinueButton() {
    const {currentScreen} = this.state;
    const shouldContinue = this.childComponents[currentScreen].canProceed();
    this.setState({inputError: undefined});

    switch (currentScreen) {
      case ScreenType.EMAIL_SCREEN:
        await this._handleEmailScreenAction(shouldContinue);
        break;
      case ScreenType.PASSCODE_SCREEN:
        await this._handlePasscodeScreenAction();
        break;
      case ScreenType.PASSWORD_SCREEN:
        await this._handlePasswordScreenAction(shouldContinue);
        break;
      default:
        break;
    }

    const canGoNext =
      shouldContinue &&
      this.state.currentScreen < this.childComponents.length - 1;
    if (canGoNext && this.state.currentScreenStatus === Status.SUCCESS) {
      const nextIndex = this.state.currentScreen + 1;
      this.setState(
        {currentScreen: nextIndex, currentScreenStatus: Status.ERROR},
        () => {
          this._childFlatList.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        },
      );
    }

    if (
      this.state.currentScreenStatus === Status.SUCCESS &&
      this.state.currentScreen === ScreenType.PASSWORD_SCREEN
    ) {
      this.props.navigation.navigate(RouteNames.Auth.EmailLogin);
    }
  }

  private async _handleEmailScreenAction(shouldContinue: boolean) {
    if (!shouldContinue) {
      this.setState({inputError: strings.NotEmailType});
      this.setState({currentScreenStatus: Status.ERROR});
      return;
    }
    await this._getForgotPasswordToken();
    if (this.state.currentScreenStatus === Status.ERROR) {
      this.setState({inputError: strings.EmailNotFound});
      return;
    }
  }

  private async _handlePasscodeScreenAction() {
    await this._verifyForgotPasswordToken();
    if (this.state.currentScreenStatus === Status.ERROR) {
      this.setState({inputError: strings.ResetPasswordVerificationError});
    }
  }

  private async _handlePasswordScreenAction(shouldContinue: boolean) {
    if (!shouldContinue) {
      this.setState({currentScreenStatus: Status.ERROR});
      this._notifyPasswordError();
      return;
    }
    await this._resetPassword();
    if (this.state.currentScreenStatus === Status.ERROR) {
      this._notifyPasswordError();
    } else {
      Alert.alert(strings.PasswordResetSuccess);
    }
  }

  private _notifyPasswordError() {
    if (!isValidPassword(this.state.password, 1)) {
      this.setState({inputError: strings.InvalidPasswordErrorType1});
    } else if (this.state.password !== this.state.reenteredPassWord) {
      this.setState({inputError: strings.UnmatchedPasswords});
    } else {
      this.setState({inputError: strings.Error});
    }
  }

  private async _getForgotPasswordToken() {
    try {
      await this._accountService.getForgotPasswordToken(this.state.email);
      this.setState({currentScreenStatus: Status.SUCCESS});
    } catch (error) {
      this.setState({currentScreenStatus: Status.ERROR});
    }
  }

  private async _verifyForgotPasswordToken() {
    try {
      await this._accountService.verifyForgotPasswordToken(this.state.passcode);
      this.setState({currentScreenStatus: Status.SUCCESS});
    } catch (error) {
      this.setState({currentScreenStatus: Status.ERROR});
    }
  }

  private async _resetPassword() {
    try {
      await this._accountService.resetPassword(
        this.state.password,
        this.state.passcode,
      );
      this.setState({currentScreenStatus: Status.SUCCESS});
    } catch (error) {
      this.setState({currentScreenStatus: Status.ERROR});
    }
  }

  private _renderInputError(inputError: string): JSX.Element {
    return <WrongInputError errorDescription={inputError} />;
  }
}
