// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { Image, SafeAreaView, StyleSheet, View, StatusBar } from "react-native";
import { BuyOrder } from "../../../Shared/Model";
import { BuyOrderHistoryPayload } from "../../../Shared/Payload";
import { FlatList } from "react-native-gesture-handler";
import { Styles } from "../../../Assets";
import { StringUtils } from "../../../Utilities";
import { Text } from "../../../Shared/UI";
import humanize from "humanize-duration";

export interface ITransactionBuyTabScreenProps {
  buyOrderHistoryState?: BuyOrderHistoryPayload;
  // dispatch props
  getBuyHistory: () => void;
}

export interface ITransactionBuyTabState {
  currentTimeInSeconds: number;
}

export class TransactionBuyTabScreen extends React.Component<ITransactionBuyTabScreenProps, ITransactionBuyTabState> {
  public static navigationOptions = {
    tabBarLabel: "Mua"
  };
  private getCurrentTimeTimeout: NodeJS.Timeout;

  public constructor(props: ITransactionBuyTabScreenProps) {
    super(props);
    this.state = {
      currentTimeInSeconds: new Date().getTime()
    };
    this.getCurrentTimeTimeout = setInterval(() => {
      this.setState({
        currentTimeInSeconds: new Date().getTime()
      });
    }, 1000);
  }

  public /** override */ componentDidMount() {
    this.props.getBuyHistory();
  }

  public /** override */ componentWillUnmount() {
    clearInterval(this.getCurrentTimeTimeout);
  }

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <FlatList
          data={this.props.buyOrderHistoryState!.buyHistory!}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => this._renderBuyOrder(item)}
        />
      </SafeAreaView>
    );
  }

  private _renderBuyOrder(buyOrder: BuyOrder) {
    const rawTime = this.state.currentTimeInSeconds - new Date(buyOrder.createdAt!).getTime();
    const timepassed = humanize(rawTime, { language: "vi", largest: 1, round: true });

    return (
      <View>
        <View style={styles.transactionItemContainer}>
          <Image
            source={{ uri: buyOrder.sellOrder.shoe!.imageUrl }}
            style={{ width: 90, height: 90 }}
            resizeMode={"contain"}
          />
          <View style={{ flex: 3, marginLeft: 25 }}>
            <Text.Callout>{buyOrder.sellOrder.shoe!.title}</Text.Callout>
            <Text.Footnote>{timepassed} trước</Text.Footnote>
            <View style={styles.priceContainer}>
              <View>
                <Text.Subhead>Giá mua</Text.Subhead>
                <Text.Callout style={{ color: Styles.TextPrimaryColor }}>
                  {StringUtils.toCurrencyString(buyOrder.soldPrice.toString())}
                </Text.Callout>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.listDivider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  title: {
    fontSize: 22,
    fontFamily: "RobotoCondensed-Regular",
    paddingTop: 30,
    paddingBottom: 24,
    paddingLeft: 14
  },
  line: {
    height: 0.3,
    backgroundColor: "#BCBBC1",
    marginHorizontal: 20
  },
  transactionItemContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 25,
    alignItems: "center"
  },
  priceContainer: {
    flexDirection: "row",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "space-between"
  },
  listDivider: {
    marginHorizontal: 25,
    height: 1,
    backgroundColor: "gainsboro"
  }
});
