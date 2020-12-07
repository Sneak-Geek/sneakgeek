//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from 'react';
import { View, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import styles from './styles';
import { Input, Button, Icon } from 'react-native-elements';
import { Account } from '../../Shared/Model';
import { Text } from '../../Shared/UI';
import * as Assets from '../../Assets';
import * as StringUtil from '../../Utilities/StringUtil';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ScrollView } from 'react-native-gesture-handler';
import { NetworkRequestState } from '../../Shared/State';

export interface ILoginScreenProps {
  currentAccount: Account | null;
  isAuthenticating: boolean;
  authenticationError?: any;
  isAuthenticatingWithFacebook: boolean;
  isAuthenticationCancelled: boolean;
  checkAccountWithEmailState: {
    state: NetworkRequestState;
    error?: any;
    existStatus?: boolean;
  };

  // dispatch props
  facebookLogin: () => void;
  googleLogin: () => void;
  navigateToHome: () => void;
  displayDebugDialog: () => void;
  checkEmailExists: (email: string) => void;
}

interface State {
  currentEmail: string;
  shouldEmailActive: boolean;
}

export default class LoginScreen extends React.Component<ILoginScreenProps, State> {
  static navigationOptions = {
    header: null,
  };

  public constructor /** override */(props: ILoginScreenProps) {
    super(props);
    this.state = {
      currentEmail: '',
      shouldEmailActive: false,
    };
  }

  private _validateEmail() {
    const { currentEmail } = this.state;
    this.setState({ shouldEmailActive: StringUtil.isValidEmail(currentEmail) });
  }

  private _checkEmailExistsAndLogin() {
    let { shouldEmailActive, currentEmail } = this.state;
    if (shouldEmailActive) {
      this.props.checkEmailExists(currentEmail);
    }
  }

  public /** override */ render() {
    return (
      <SafeAreaView style={styles.rootContainer}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {this._renderSocialContainer()}
            <View style={styles.separator} />
            {this._renderEmailBasedContainer()}
          </ScrollView>
        </View>
        {this._renderButton()}
        <KeyboardSpacer topSpacing={Assets.Device.isIphoneX ? -Assets.Device.bottomSpace : 0} />
      </SafeAreaView>
    );
  }

  public componentDidUpdate(prevProps: ILoginScreenProps) {
    if (
      this.props.checkAccountWithEmailState &&
      this.props.checkAccountWithEmailState.state === NetworkRequestState.FAILED &&
      this.props.checkAccountWithEmailState.error !== prevProps.checkAccountWithEmailState.error
    ) {
      Alert.alert('Đã xảy ra lỗi khi đăng nhập, xin vui lòng thử lại sau');
    }
  }

  private _renderSocialContainer() {
    return (
      <View style={styles.socialContainer}>
        <Text.Body style={styles.label}>Đăng nhập qua</Text.Body>
        {this._renderSocialButton('Tài khoản Google', Assets.Icons.Google, this.props.googleLogin)}
        {this._renderSocialButton('Tài khoản Facebook', Assets.Icons.Facebook, this.props.facebookLogin)}
      </View>
    );
  }

  private _renderSocialButton(title: string, icon: any, onPress: () => void): JSX.Element {
    return (
      <TouchableOpacity onPress={onPress} style={styles.socialButton}>
        <View style={styles.socialButtonInner}>
          <Image source={icon} />
          <Text.Body style={styles.socialButtonText}>{title}</Text.Body>
        </View>
      </TouchableOpacity>
    );
  }

  private _renderEmailBasedContainer() {
    return (
      <View style={styles.emailBasedContainer}>
        <View style={{ flex: 1, width: '100%' }}>
          <Text.Body style={styles.socialLabel}>Hoặc sử dụng email</Text.Body>
          <Input
            value={this.state.currentEmail}
            onChangeText={currentEmail => this.setState({ currentEmail }, () => this._validateEmail())}
            containerStyle={{ width: '100%', paddingHorizontal: 0 }}
            inputContainerStyle={styles.emailContainerStyle}
            placeholder={'taikhoan@email.com'}
            leftIcon={<Icon type={'ionicon'} name={'md-mail'} size={24} color={Assets.Styles.ButtonDisabledColor} />}
            rightIcon={
              this.props.checkAccountWithEmailState.state === NetworkRequestState.REQUESTING && (
                <ActivityIndicator style={{ marginRight: 10 }} />
              )
            }
            underlineColorAndroid={'transparent'}
            inputStyle={styles.emailInputStyle}
            autoCapitalize="none"
          />
        </View>
      </View>
    );
  }

  private _renderButton() {
    return (
      <Button
        title={
          this.props.checkAccountWithEmailState.state === NetworkRequestState.REQUESTING
            ? 'Kiểm tra tài khoản...'
            : 'Đăng nhập'
        }
        buttonStyle={[
          styles.authButtonContainer,
          {
            backgroundColor: this.state.shouldEmailActive
              ? Assets.Styles.AppPrimaryColor
              : Assets.Styles.ButtonDisabledColor,
          },
        ]}
        titleStyle={{
          fontSize: 18,
          fontFamily: 'RobotoCondensed-Regular'
        }}
        onPress={() => this._checkEmailExistsAndLogin()}
      />
    );
  }
}
