import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import { Icon } from "react-native-elements";
import { StackActions, NavigationScreenProps, NavigationScreenProp, NavigationRoute } from "react-navigation";
import * as Assets from "../../Assets";
import { TextStyle } from "../../Shared/UI/Text";
import { NetworkRequestState } from "../../Shared/State";

interface IForgotPasswordScreenState {
  type: string;
  email: string;
  code: string;
  passwordConfirm: string;
  password: string;
}

interface IForgotPasswordScreenProps {
  requestTokenState: NetworkRequestState;
  verifyTokenState: NetworkRequestState;

  // dispatch props
  requestTokenConfirm: (email: string) => Promise<{ message: string }>;
  verifyToken: (email: string, token: string) => Promise<{ message: string }>;
  setNewPassword: (email: string, token: string, newPassword: string) => Promise<{ message: string }>;
  navigateToHome: () => void;
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class ForgotPasswordScreen extends React.Component<IForgotPasswordScreenProps, IForgotPasswordScreenState> {
  public static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    headerStyle: {
      borderBottomWidth: 0
    },
    headerTitleStyle: TextStyle.title2,
    title: "Quên mật khẩu",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    )
  });

  constructor(props: any) {
    super(props);
    this.state = {
      email: this.props.navigation.getParam("email") || "",
      code: "",
      passwordConfirm: "",
      password: "",
      type: "inputEmail"
    };
  }

  public componentDidUpdate(prevProps: IForgotPasswordScreenProps) {
    switch (this.state.type) {
      case "inputEmail":
        if (
          prevProps.requestTokenState !== this.props.requestTokenState &&
          this.props.requestTokenState === NetworkRequestState.SUCCESS
        ) {
          this.setState({ type: "inputCode" });
        }
        break;
      case "inputPassword":
        if (
          prevProps.verifyTokenState !== this.props.verifyTokenState &&
          this.props.verifyTokenState === NetworkRequestState.SUCCESS
        ) {
          this.setState({ type: "inputPassword" });
        }
        break;
      default:
        break;
    }
  }

  private _onPress() {
    let { type, email, code, password, passwordConfirm } = this.state;
    if (type === "inputEmail") {
      this.props.requestTokenConfirm(email);
    } else if (type === "inputCode") {
      this.props.verifyToken(email, code);
    } else if (type === "inputPassword") {
      if (password.length < 1) {
        Alert.alert("Thông báo", "Vui lòng nhập mật khẩu");
        return;
      }

      if (password !== passwordConfirm) {
        Alert.alert("Thông báo", "Mật khẩu không trùng nhau");
        return;
      }

      this.props.setNewPassword(email, code, password);
    }
  }

  public render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>{this.renderContent()}</ScrollView>
        </View>
        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.7} onPress={this._onPress.bind(this)}>
          <Text style={styles.titleButton}>TIẾP TỤC</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  private renderContent() {
    let { type } = this.state;
    switch (type) {
      case "inputEmail":
        return this.renderInputEmail();
      case "inputCode":
        return this.renderInputCode();
      case "inputPassword":
        return this.renderInputPassword();
      default:
        return null;
    }
  }

  private renderInputEmail() {
    let { email } = this.state;
    return (
      <View>
        <Text
          style={styles.title}
        >{`Để khôi phục lại mật khẩu, bạn cần điền địa chỉ email của tài khoản đăng nhập:`}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.absolute}>
            <Text style={styles.email}>Email</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={"Email của bạn"}
            value={email}
            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
            onChangeText={email => this.setState({ email })}
            selectionColor={Assets.Styles.AppPrimaryColor}
            autoCapitalize={"none"}
          />
        </View>
        <Image
          source={Assets.Icons.Thumb1}
          style={{
            marginTop: 100,
            width: 261,
            height: 261,
            resizeMode: "contain",
            marginLeft: 26
          }}
        />
      </View>
    );
  }

  private renderInputCode() {
    let { code } = this.state;
    return (
      <View>
        <Text style={styles.title}>{`Email chứa mã code để đặt lại mật khẩu đã được gửi đến hòm thư của bạn.`}</Text>
        <Text style={[styles.title, { paddingTop: 20 }]}>Nhập mã code trong email của bạn vào đây:</Text>
        <View style={styles.inputContainer}>
          <View style={styles.absolute}>
            <Text style={styles.email}>Mã code</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={"Mã code"}
            value={code}
            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
            onChangeText={code => this.setState({ code })}
            selectionColor={Assets.Styles.AppPrimaryColor}
            autoCapitalize={"none"}
          />
        </View>
        <Image
          source={Assets.Icons.Thumb2}
          style={{
            marginTop: 54,
            width: 261,
            height: 261,
            resizeMode: "contain",
            marginLeft: 26
          }}
        />
      </View>
    );
  }

  private renderInputPassword() {
    let { password, passwordConfirm } = this.state;
    return (
      <View>
        <Text style={styles.title}>{`Điền mật khẩu mới cho tài khoản của bạn`}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.absolute}>
            <Text style={styles.email}>Mật khẩu</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu của bạn"
            value={password}
            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
            onChangeText={password => this.setState({ password })}
            selectionColor={Assets.Styles.AppPrimaryColor}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Điền lại mật khẩu"
            value={passwordConfirm}
            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
            onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
            selectionColor={Assets.Styles.AppPrimaryColor}
            autoCapitalize="none"
          />
        </View>
        <Image
          source={Assets.Icons.Thumb3}
          style={{
            marginTop: 48,
            width: 261,
            height: 261,
            resizeMode: "contain",
            marginLeft: 20
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 42
  },
  title: {
    fontSize: 18,
    fontFamily: "RobotoCondensed-Regular",
    lineHeight: 25
  },
  inputContainer: {
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    marginTop: 30
  },
  email: {
    fontSize: 12,
    fontFamily: "RobotoCondensed-Regular",
    color: "black",
    opacity: 0.4,
    paddingLeft: 3,
    paddingRight: 5
  },
  absolute: {
    position: "absolute",
    left: 12,
    top: -7,
    backgroundColor: "white"
  },
  input: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 16,
    flex: 1
  },
  buttonContainer: {
    backgroundColor: "black",
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  titleButton: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    color: "white"
  }
});
