//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from "react";
import { View, SafeAreaView, FlatList, Image } from "react-native";
import { Text } from "../../Shared/UI";
import { toCurrencyString } from "../../Utilities/StringUtil";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Assets from "../../Assets";
import { ScreenProps, StackActions } from "react-navigation";
import { Icon } from "react-native-elements";

export interface PaymentOptionsScreenProps {
  navigateToAddCard: () => void;
}

export class PaymentOptionsScreen extends React.Component<PaymentOptionsScreenProps> {
  static navigationOptions = (navigationConfig: ScreenProps) => ({
    title: "Hình thức thanh toán",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => navigationConfig.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    )
  });

  public /** override */ render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, marginTop: 50 }}>
          {this._renderSneakGeekBalance()}
          {this._renderOptions()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderSneakGeekBalance(): JSX.Element {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text.Body>Số dư ví SneakGeek hiện tại</Text.Body>
        <Text.Title1>{toCurrencyString("402000000")}</Text.Title1>
      </View>
    );
  }

  private _renderOptions(): JSX.Element {
    return (
      <View style={{ marginTop: 40 }}>
        <Text.Subhead style={{ marginLeft: 20 }}>Hình thức thanh toán</Text.Subhead>
        <FlatList
          keyExtractor={(_itm, idx) => idx.toString()}
          data={[""]}
          renderItem={({ item }) => this._renderPaymentOptions(item)}
          style={{ marginTop: 15 }}
        />
      </View>
    );
  }

  private _renderPaymentOptions(item: string): JSX.Element | null {
    if (item === "") {
      return (
        <TouchableOpacity onPress={() => this.props.navigateToAddCard()}>
          <View
            style={{
              backgroundColor: Assets.Styles.ListItemBackgroundColor,
              height: Assets.Styles.ButtonHeight,
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: 40
            }}
          >
            <Image
              source={Assets.Icons.AddCard}
              resizeMode={"contain"}
              style={{ width: 20, height: 20 }}
            />
            <Text.Callout style={{ marginLeft: 20, color: Assets.Styles.AppPrimaryColor }}>
              Thêm thẻ thanh toán
            </Text.Callout>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  }
}
