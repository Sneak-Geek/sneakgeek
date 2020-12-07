import * as React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  Image
} from "react-native";
import { StackActions, NavigationScreenProps } from "react-navigation";
import { Icon } from "react-native-elements";
import * as Assets from "../../Assets";

interface IShareScreenScreenProps {}

interface IShareScreenScreenState {}

export class ShareScreen extends React.Component<
  IShareScreenScreenProps,
  IShareScreenScreenState
> {
  static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    title: "Chia sẻ",
    headerTitleStyle: {
      fontSize: 17,
      fontFamily: "RobotoCondensed-Bold"
    },
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

  public render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView
            style={{ paddingTop: 34 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <Text style={styles.title}>Mời bạn bè tham gia SneakGeek ngay!</Text>
            <Text style={styles.codeTitle}>Mã số của bạn</Text>
            <Text style={styles.code}>6271hahqy1</Text>
            <Text style={styles.title}>Hoặc scan mã QR dưới đây:</Text>
            <Image style={styles.qrcode} source={Assets.Icons.QrCode} />
          </ScrollView>
          {this._renderButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderButton() {
    return (
      <TouchableOpacity style={styles.containerButton}>
        <Text style={styles.titleButton}>Xác nhận</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  contentContainer: {
    flex: 1
  },
  containerButton: {
    height: Assets.Styles.ButtonHeight,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },
  titleButton: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Bold",
    color: "white"
  },
  title: {
    fontSize: 22,
    fontFamily: "RobotoCondensed-Bold",
    paddingLeft: 20,
    textAlign: "left"
  },
  codeTitle: {
    paddingTop: 34,
    paddingBottom: 23,
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    textAlign: "center"
  },
  code: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Bold",
    textAlign: "center",
    paddingBottom: 99
  },
  qrcode: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginTop: 62,
    alignSelf: "center"
  }
});
