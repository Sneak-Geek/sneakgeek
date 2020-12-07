// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { SellOrder } from "../../../Shared/Model";
import { ActivityIndicator, FlatList, Image, StyleSheet, View, RefreshControl, StatusBar } from "react-native";
import humanize from "humanize-duration";
import { Text } from "../../../Shared/UI";
import { Styles } from "../../../Assets";
import { SellOrderHistoryPayload } from "../../../Shared/Payload";
import { NetworkRequestState } from "../../../Shared/State";
import { StringUtils } from "../../../Utilities";

export interface ITransactionSellTabProps {
  sellHistoryState?: SellOrderHistoryPayload;

  // dispatch props
  getSellHistory: () => void;
  navigateToSearch: () => void;
  onShoeClick: () => void;
}

export interface ITransactionSellTabState {
  currentTimeInSeconds: number;
}

export class TransactionSellTab extends React.Component<ITransactionSellTabProps, ITransactionSellTabState> {
  public static navigationOptions = {
    tabBarLabel: "Bán"
  };

  private getCurrentTimeTimeOut: NodeJS.Timeout;

  public constructor(props: ITransactionSellTabProps) {
    super(props);
    this.state = {
      currentTimeInSeconds: new Date().getTime()
    };
    this.getCurrentTimeTimeOut = setInterval(() => {
      this.setState({
        currentTimeInSeconds: new Date().getTime()
      });
    }, 1000);
  }

  public /** override */ componentDidMount() {
    this.props.getSellHistory();
  }

  public /** override */ componentWillUnmount() {
    clearInterval(this.getCurrentTimeTimeOut);
  }

  public /** override */ render(): JSX.Element {
    return (
      <View style={{ flex: 1, alignItems: "stretch" }}>
        <StatusBar barStyle={"dark-content"} />
        {this._renderSellTransactions()}
      </View>
    );
  }

  private _renderSellTransactions(): JSX.Element {
    const { sellHistoryState } = this.props;
    const sellHistory = sellHistoryState?.sellHistory || [];
    const state = sellHistoryState?.state;

    if (state === NetworkRequestState.REQUESTING) {
      return <ActivityIndicator />;
    } else if (state === NetworkRequestState.FAILED) {
      return <Text.Body>Đã có lỗi xảy ra, xin vui lòng thử lại</Text.Body>;
    }

    if (sellHistory.length === 0) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text.Body>Hiện tại bạn chưa bán đôi giày nào</Text.Body>
        </View>
      );
    }
    const refreshControl = (
      <RefreshControl
        refreshing={this.props.sellHistoryState!.state === NetworkRequestState.REQUESTING}
        onRefresh={() => this.props.getSellHistory()}
      />
    );

    return (
      <FlatList
        refreshControl={refreshControl}
        style={{ flex: 1 }}
        data={sellHistory}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => this._renderSellItem(item)}
      />
    );
  }

  private _renderSellItem(sellOrder: SellOrder): JSX.Element {
    const shoe = sellOrder.shoe?.[0];
    const latestPrice = sellOrder.priceHistory!.sort(
      (x, y) => new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime()
    )[0].price;
    const rawTime = this.state.currentTimeInSeconds - new Date(sellOrder.createdAt!).getTime();
    const timepassed = humanize(rawTime, { language: "vi", largest: 1, round: true });

    return (
      <View>
        <View style={styles.transactionItemContainer}>
          <Image source={{ uri: shoe!.imageUrl }} style={{ width: 90, height: 90 }} resizeMode={"contain"} />
          <View style={{ flex: 3, marginLeft: 25 }}>
            <Text.Callout>{shoe!.title}</Text.Callout>
            <Text.Footnote>{timepassed} trước</Text.Footnote>
            <View style={styles.priceContainer}>
              <View>
                <Text.Subhead>Giá bán</Text.Subhead>
                <Text.Callout style={{ color: Styles.TextPrimaryColor }}>
                  {StringUtils.toCurrencyString(latestPrice!.toString())}
                </Text.Callout>
              </View>
              {sellOrder.orderState === 2 && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Styles.AppPrimaryColor,
                    borderRadius: Styles.ButtonBorderRadius
                  }}
                >
                  <Text.Body style={{ color: Styles.AppPrimaryColor, marginVertical: 5, marginHorizontal: 8 }}>
                    Đã bán
                  </Text.Body>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.listDivider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transactionItemContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 25,
    alignItems: "center"
  },

  remainingTimeContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center"
  },

  clockIcon: { width: 18, aspectRatio: 1, tintColor: "black", marginRight: 5 },

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
