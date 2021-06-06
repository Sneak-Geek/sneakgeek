import * as React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Icon } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";
import * as Assets from "../../Assets";
import Swiper from "react-native-swiper";
import KeyboardSpacer from "react-native-keyboard-spacer";
interface IOrderAuctionScreenState {
  money: string;
}

interface IOrderAuctionScreenProps {
  navigateToPayment: () => void;
}

export class OrderAuctionScreen extends React.Component<IOrderAuctionScreenProps, IOrderAuctionScreenState> {
  public static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    title: "Đặt giá mua",
    headerTitleStyle: {
      fontSize: 24,
      fontFamily: "RobotoCondensed-Regular"
    },
    headerStyle: {
      borderBottomWidth: 0
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

  public constructor(props: any) {
    super(props);
    this.state = {
      money: ""
    };
  }

  public render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView>
            {this._renderImage()}
            {this._renderContent()}
            {this._renderInputMoney()}
          </ScrollView>
          {this._renderButton()}
        </View>
        {Assets.Device.IS_IOS && (
          <KeyboardSpacer topSpacing={Assets.Device.isIphoneX ? -Assets.Device.bottomSpace : 0} />
        )}
      </SafeAreaView>
    );
  }

  private _renderImage() {
    return (
      <View style={styles.swipercontainer}>
        <Swiper dotStyle={styles.dot} activeDotStyle={styles.activeDot} paginationStyle={styles.paginationStyle}>
          <View
            style={{
              backgroundColor: "red",
              flex: 1,
              height: Dimensions.get("window").width - 40,
              borderRadius: 4
            }}
          />
          <View
            style={{
              backgroundColor: "yellow",
              flex: 1,
              height: Dimensions.get("window").width - 40,
              borderRadius: 4
            }}
          />
          <View
            style={{
              backgroundColor: "green",
              flex: 1,
              height: Dimensions.get("window").width - 40,
              borderRadius: 4
            }}
          />
          <View
            style={{
              backgroundColor: "aqua",
              flex: 1,
              height: Dimensions.get("window").width - 40,
              borderRadius: 4
            }}
          />
        </Swiper>
      </View>
    );
  }

  private _renderContent() {
    return (
      <View style={styles.middleContainer}>
        <Text style={styles.shoeName} numberOfLines={1} ellipsizeMode="tail">
          NMD_R1 'Speckle Pack - white'
        </Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>Giá đăng</Text>
            <Text style={styles.curency}>
              VND <Text style={styles.money}>1.600.000</Text>
            </Text>
          </View>
          <View>
            <Text style={[styles.title, { textAlign: "right" }]}>Giá cao nhất hiện tại</Text>
            <Text style={[styles.curency, { textAlign: "right" }]}>
              VND <Text style={[styles.money, { textAlign: "right" }]}>1.600.000</Text>
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 17 }}>
          <Text style={styles.title}>Thời gian còn lại</Text>
          <Text style={styles.descrip}>23 giờ 20 phút</Text>
        </View>
        <View style={{ paddingTop: 17 }}>
          <Text style={styles.title}>Miêu tả</Text>
          <Text style={styles.descrip}>Cỡ 8.5, Đã sử dụng, Nguyên hộp mới, ố vàng</Text>
        </View>
      </View>
    );
  }

  private _renderInputMoney() {
    return (
      <View style={styles.inputMoneyContainer}>
        <Text style={styles.descrip}>Đặt giá mua</Text>
        <View
          style={{
            height: 28,
            padding: 5,
            backgroundColor: "rgba(26, 188, 156, 0.1)",
            flexDirection: "row",
            alignItems: "flex-end",
            borderBottomWidth: 1,
            borderColor: Assets.Styles.AppPrimaryColor
          }}
        >
          <Text style={styles.curency}>VND </Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={[styles.money, { padding: 0, minWidth: 70 }]}
            placeholder="0"
            value={this.state.money}
            onChangeText={text => this.setState({ money: text })}
          />
        </View>
      </View>
    );
  }

  private _renderButton() {
    return (
      <TouchableOpacity style={styles.containerButton} onPress={this.props.navigateToPayment}>
        <Text style={styles.titleButton}>TIẾP TỤC</Text>
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
  swipercontainer: {
    paddingHorizontal: 20,
    height: Dimensions.get("window").width - 40
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "white",
    opacity: 0.7
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "white"
  },
  paginationStyle: {
    bottom: 15
  },
  middleContainer: {
    paddingTop: 30,
    paddingHorizontal: 30
  },
  shoeName: {
    fontSize: 20,
    fontFamily: "RobotoCondensed-Regular"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 27
  },
  title: {
    fontSize: 16,
    fontFamily: "RobotoCondensed-Regular",
    opacity: 0.6,
    paddingBottom: 8
  },
  curency: {
    fontSize: 16,
    fontFamily: "RobotoCondensed-Regular"
  },
  money: {
    fontSize: 24,
    fontFamily: "RobotoCondensed-Regular"
  },
  descrip: {
    fontSize: 20,
    fontFamily: "RobotoCondensed-Regular"
  },
  inputMoneyContainer: {
    paddingTop: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 70
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
  }
});
