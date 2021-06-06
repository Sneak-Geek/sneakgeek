// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { Image, SafeAreaView, StyleSheet, View, LayoutChangeEvent, ActivityIndicator } from "react-native";
import { getLatestPrice, SellOrder, Shoe } from "../../Shared/Model";
import { Icon } from "react-native-elements";
import { NavigationRoute, NavigationScreenProp, ScreenProps, StackActions } from "react-navigation";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "../../Shared/UI";
import { Styles } from "../../Assets";
import { container, Types } from "../../Config/Inversify";
import { IAppSettings } from "../../Service/AppSettingsService";

export interface IBuySelectionScreenProps {
  navigation: NavigationScreenProp<NavigationRoute>;
  availableSellOrders?: SellOrder[];

  // dispatch props
  navigateToPayment: (order?: SellOrder) => void;
}

export interface IBuySelectionScreenState {
  selectedSize: number;
  imageHeight: number;
  safeAreaHeight: number;
}

export class BuySelectionScreen extends React.Component<IBuySelectionScreenProps, IBuySelectionScreenState> {
  public static navigationOptions = (navigationConfig: ScreenProps) => ({
    title: "Chọn cỡ và giá",
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

  private shoeId: string;
  private isOldCondition: boolean;

  public constructor(props: IBuySelectionScreenProps) {
    super(props);
    this.shoeId = this.props.availableSellOrders?.[0].shoeId || "";
    this.isOldCondition = this.props.navigation.getParam("isOldCondition");

    if (typeof this.shoeId === "undefined" || typeof this.isOldCondition === "undefined") {
      throw new Error("Invalid arguments to buy shoe");
    }

    this.state = {
      selectedSize: -1,
      imageHeight: 0,
      safeAreaHeight: 0
    };
  }

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1 }}
          onLayout={event => this.setState({ safeAreaHeight: event.nativeEvent.layout.height })}
        >
          <View onLayout={this._onHeightLayout.bind(this)}>
            {this._renderShoeImage()}
            {/* {this._renderNote()} */}
            {this._renderDivider()}
          </View>
          {this._renderAvailableSellOrders()}
          {this._renderConfirmButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderShoeImage() {
    const shoe = this.props.availableSellOrders?.[0].shoe?.[0] as Shoe;
    return (
      <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
        <Image source={{ uri: shoe.imageUrl }} style={{ width: 200, aspectRatio: 1.5 }} />
        <Text.Body style={{ marginTop: 15 }}>{shoe.title}</Text.Body>
      </View>
    );
  }

  private _renderDivider() {
    return <View style={{ width: "100%", height: 1, backgroundColor: Styles.AppShadowColor }} />;
  }

  private _renderAvailableSellOrders() {
    if (this.state.safeAreaHeight === 0) {
      return <ActivityIndicator />;
    }

    const settings = container.get<IAppSettings>(Types.IAppSettingsService);
    const shoeSizes: string[] = settings.getSettings().RemoteSettings.shoeSizes.Adult || [];

    return (
      <FlatList
        style={{ alignSelf: "center", marginHorizontal: 5, marginTop: 15, marginBottom: 45 }}
        numColumns={4}
        data={shoeSizes.map(t => parseFloat(t))}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => this._renderPricePerSize(item)}
      />
    );
  }

  private _renderPricePerSize(size: number) {
    const condition = this.isOldCondition ? "Cũ" : "Mới";
    const order = this.props.availableSellOrders?.find(
      t => t.shoeCondition === condition && t.shoeSize === size.toString()
    );
    const price = order ? getLatestPrice(order) / 1000000.0 : -1;
    const backgroundColor = size === this.state.selectedSize ? Styles.AppPrimaryColor : "white";
    const height = (this.state.safeAreaHeight - this.state.imageHeight) / 5 - 5;
    const textColor = size === this.state.selectedSize ? Styles.TextSecondaryColor : Styles.TextPrimaryColor;

    return (
      <TouchableOpacity onPress={() => this._onSelectSize(size, price)}>
        <View style={[styles.priceContainer, { backgroundColor, height }]}>
          <Text.Callout numberOfLines={1} style={{ color: textColor, marginHorizontal: 10 }}>
            {price !== -1 ? `${price}M` : "-"}
          </Text.Callout>
          <Text.Footnote style={{ color: textColor }}>S: {size}</Text.Footnote>
        </View>
      </TouchableOpacity>
    );
  }

  private _onSelectSize(size: number, price: number) {
    {
      if (price !== -1 && size !== this.state.selectedSize) {
        this.setState({ selectedSize: size });
      }

      if (size === this.state.selectedSize) {
        this.setState({ selectedSize: -1 });
      }
    }
  }

  private _renderConfirmButton() {
    const order = this.props.availableSellOrders?.find(t => t.shoeSize === this.state.selectedSize.toString());
    const backgroundColor = this.state.selectedSize !== -1 ? Styles.ButtonPrimaryColor : Styles.ButtonDisabledColor;

    return (
      <View style={{ ...styles.confirmButton, backgroundColor }} onLayout={this._onHeightLayout.bind(this)}>
        <TouchableOpacity
          style={{ alignSelf: "stretch", alignItems: "center", justifyContent: "center", flex: 1 }}
          disabled={this.state.selectedSize === -1}
          onPress={() => this.props.navigateToPayment(order)}
        >
          <Text.Body style={{ color: Styles.TextSecondaryColor, textAlign: "center" }}>Tiếp tục</Text.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _onHeightLayout(event: LayoutChangeEvent) {
    const oldHeight = this.state.imageHeight;
    const newHeight = oldHeight + event.nativeEvent.layout.height;

    this.setState({ imageHeight: newHeight });
  }
}

const styles = StyleSheet.create({
  priceContainer: {
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: Styles.AppAccentColor,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: 5
  },

  confirmButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flex: 1,
    right: 0,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  }
});
