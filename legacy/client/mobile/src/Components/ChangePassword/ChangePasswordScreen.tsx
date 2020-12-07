import * as React from 'react';
import { View, StyleSheet, Text, TextInput, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import {
  StackActions,
  NavigationScreenProps,
} from "react-navigation";
import { Icon } from 'react-native-elements';
import * as Assets from "../../Assets";
import { NetworkRequestState } from "../../Shared/State";

interface IChangePasswordScreenProps {
  onChangePassword: (currentPassword: string, newPassword: string) => void;
  changePasswordState: NetworkRequestState;
}
interface IChangePasswordScreenState {
  showCurPass: boolean,
  showNewPass: boolean,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
}
export class ChangePasswordScreen extends React.Component<IChangePasswordScreenProps, IChangePasswordScreenState> {

  static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    headerStyle: ({
      borderBottomWidth: 0,
    })
    ,
    title: "ĐỔI MẬT KHẨU",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.popToTop())}
      />
    ),
  });

  state = {
    showCurPass: false,
    showNewPass: false,
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  }

  public componentDidUpdate(prevProps: IChangePasswordScreenProps) {
    if (
      prevProps.changePasswordState !== this.props.changePasswordState &&
      this.props.changePasswordState === NetworkRequestState.SUCCESS
    ) {
      Alert.alert('Thông báo', 'Đổi mật khẩu thành công!')
    }
    if (
      prevProps.changePasswordState !== this.props.changePasswordState &&
      this.props.changePasswordState === NetworkRequestState.FAILED
    ) {
      Alert.alert('Thông báo', 'Đã xảy ra lỗi!')
    }
  }

  public onConfirm = () => {
    let { currentPassword, newPassword, newPasswordConfirm } = this.state;
    if (newPassword !== newPasswordConfirm) {
      Alert.alert('Thông báo', 'Mật khẩu mới không khớp nhau');
      return;
    }
    this.props.onChangePassword(currentPassword, newPassword)
  }
  public render() {
    let { showCurPass, showNewPass } = this.state;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: 'white'
        }}
      >
        <View style={styles.container}>
          <View>
            <View style={styles.titleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Mật khẩu hiện tại</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({ showCurPass: !this.state.showCurPass })}>
                <Image source={Assets.Icons.Eye} style={styles.logo} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={this.state.currentPassword}
              onChangeText={currentPassword => this.setState({ currentPassword })}
              underlineColorAndroid="transparent"
              selectionColor={Assets.Styles.AppPrimaryColor}
              placeholder="Điền mật khẩu hiện tại"
              secureTextEntry={!showCurPass}
            />
          </View>
          <View style={{ paddingTop: 40 }}>
            <View style={styles.titleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Mật khẩu mới</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({ showNewPass: !this.state.showNewPass })}>
                <Image source={Assets.Icons.Eye} style={styles.logo} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={this.state.newPassword}
              onChangeText={newPassword => this.setState({ newPassword })}
              underlineColorAndroid="transparent"
              selectionColor={Assets.Styles.AppPrimaryColor}
              placeholder="Điền mật khẩu mới"
              secureTextEntry={!showNewPass}
            />
            <View style={{ paddingTop: 20 }}>
              <TextInput
                style={styles.input}
                value={this.state.newPasswordConfirm}
                onChangeText={newPasswordConfirm => this.setState({ newPasswordConfirm })}
                underlineColorAndroid="transparent"
                selectionColor={Assets.Styles.AppPrimaryColor}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry={!showNewPass}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.onConfirm}>
          <Text style={styles.titleButton}>Xác nhận</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed-Regular',
    lineHeight: 19,
    opacity: 0.6,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#C4C4C4',
    padding: 0,
    color: '#999999',
    fontSize: 18,
    fontFamily: 'RobotoCondensed-Regular',
  },
  buttonContainer: {
    backgroundColor: 'black',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    fontSize: 20,
    fontFamily: 'RobotoCondensed-Regular',
    color: 'white',
  }
})