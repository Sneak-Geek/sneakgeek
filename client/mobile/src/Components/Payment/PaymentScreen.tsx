// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProps, ScreenProps, StackActions } from "react-navigation";
import { Icon } from "react-native-elements";
import * as Assets from "../../Assets";
import { RowCard, Text } from "../../Shared/UI";
import { getLatestPrice, SellOrder, Account, Profile } from "../../Shared/Model";
import { toCurrencyString } from "../../Utilities/StringUtil";
import { NetworkRequestState } from "../../Shared/State";
import { container, Types } from "../../Config/Inversify";
import { ITransactionService } from "../../Service";

export interface IPaymentScreenProps {
  account?: Account;
  profile?: Profile;
  navigation: ScreenProps;
  buyState: NetworkRequestState;
  // dispatch props
  navigateToHome: () => void;
  navigateToWebViewHostedPayment: (url: string) => void;
  buyShoe: (sellOrder: SellOrder) => void;
}

interface IPaymentScreenState {
  value: string;
}

export class PaymentScreen extends React.Component<IPaymentScreenProps, IPaymentScreenState> {
  public static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    title: "Thanh toán",
    headerTitleStyle: { fontSize: 17, fontFamily: "RobotoCondensed-Regular" },
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    ),
    headerRight: (
      <TouchableOpacity style={{ paddingRight: 20 }}>
        <Image source={Assets.Icons.Share} style={{ width: 20, height: 20, resizeMode: "contain" }} />
      </TouchableOpacity>
    )
  });

  private order: SellOrder | null = null;
  private transactionService: ITransactionService = container.get<ITransactionService>(Types.ITransactionService);

  public constructor(props: any) {
    super(props);
    this.state = {
      value: ""
    };
    this.order = this.props.navigation.getParam("order");
    if (!this.order) {
      throw new Error("Missing order for payment");
    }
  }

  public actionSheetOnpress = (index: number) => {
    if (index === 0) {
      this.setState({ value: "Thanh toán nội địa" });
    }
    if (index === 1) {
      this.setState({ value: "Thanh toán quốc tế" });
    }
  };

  public /** override */ render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView>
            {this._renderShoe()}
            {this._renderContent()}
          </ScrollView>
        </View>
        {this._renderButton()}
      </SafeAreaView>
    );
  }

  public /** override */ componentDidUpdate(prevProps: IPaymentScreenProps) {
    if (prevProps.buyState !== this.props.buyState) {
      if (this.props.buyState === NetworkRequestState.SUCCESS) {
        this.props.navigateToHome();
      } else if (this.props.buyState === NetworkRequestState.FAILED) {
        Alert.alert("Đã xảy ra lỗi khi mua, xin vui lòng thử lại");
      }
    }
  }

  private _renderShoe() {
    const shoe = this.order?.shoe?.[0];
    return (
      <View style={styles.topContentContainer}>
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={{ uri: shoe?.imageUrl }} resizeMode={"contain"} />
        </View>
        <View style={styles.titleContainer}>
          <Text.Body numberOfLines={2} ellipsizeMode="tail">
            {shoe?.title}
          </Text.Body>
          <Text.Footnote numberOfLines={1} ellipsizeMode="tail">
            {shoe?.colorway.join(",")}
          </Text.Footnote>
        </View>
      </View>
    );
  }

  private _renderContent() {
    const order = this.order as SellOrder;
    return (
      <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
        <RowCard title="CỠ GIÀY" description={this.order?.shoeSize} />
        <RowCard title="TÌNH TRẠNG" description={this.order?.shoeCondition} border={true} />
        <RowCard title="ĐỊA CHỈ GIAO HÀNG" description={this.props.profile?.userProvidedAddress} green={true} />
        <RowCard title="HÌNH THỨC GIAO HÀNG" description="Chuyển phát nhanh" green={true} />
        <RowCard title="GIÁ MUA" description={toCurrencyString(getLatestPrice(order).toString())} green={true} />
        <RowCard title="PHÍ GIAO HÀNG" description="VND 1,800,000" />
        <RowCard title="TỔNG CỘNG" description="VND 1,800,000" />
      </View>
    );
  }

  private _renderButton() {
    return (
      <TouchableOpacity
        style={styles.containerButton}
        onPress={() => {
          const options = ["Thanh toán nội địa", "Thanh toán quốc tế", "Huỷ"];
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex: 2
            },
            buttonIndex => {
              if (options[buttonIndex] === "Thanh toán quốc tế") {
                const url = this.transactionService.processPaymentIntl(this.order!, this.props.account!._id);
                this.props.navigateToWebViewHostedPayment(url);
              } else if (options[buttonIndex] === "Thanh toán nội địa") {
                const url = this.transactionService.processPaymentDomestic(this.order!, this.props.account!._id);
                this.props.navigateToWebViewHostedPayment(url);
              }
            }
          );
        }}
      >
        <Text.Body style={styles.titleButton}>MUA SẢN PHẨM</Text.Body>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 30
  },
  topContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10
  },
  imgContainer: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 100,
    aspectRatio: 0.5
  },

  titleContainer: {
    flex: 1,
    marginLeft: 25,
    paddingBottom: 7
  },
  code: {
    fontFamily: "RobotoCondensed-Regular",
    fontSize: 14,
    paddingTop: 5
  },
  boldText: {
    opacity: 0.6,
    fontSize: 14,
    fontFamily: "RobotoCondensed-Bold"
  },
  regularText: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    textAlign: "right"
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
