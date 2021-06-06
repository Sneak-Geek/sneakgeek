//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Shoe } from "../../Shared/Model";
import { StringUtils } from "../../Utilities";
import * as Text from "./Text";
import * as Assets from "../../Assets";

interface Props {
  shoe: Shoe;
  renderPriceOnly?: boolean;
}

export class HorizontalShoeCard extends React.Component<Props, {}> {
  render() {
    const { shoe, renderPriceOnly } = this.props;
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: shoe.imageUrl, cache: "default" }}
          style={{ width: "25%", aspectRatio: 1.5 }}
          resizeMode={"contain"}
        />
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <Text.Subhead
            numberOfLines={2}
            textBreakStrategy={"highQuality"}
            ellipsizeMode={"tail"}
          >
            {shoe.title}
          </Text.Subhead>
        </View>
        {renderPriceOnly ? this._renderPrice() : this._renderPriceWithPercentage()}
      </View>
    );
  }

  private _renderPrice() {
    return (
      <Text.Callout style={{ textAlign: "right" }} numberOfLines={1}>
        {StringUtils.toCurrencyString("3150000")}
      </Text.Callout>
    );
  }

  private _renderPriceWithPercentage() {
    const negative =
      this.props.shoe.title.length % 2 === 0
        ? Assets.Styles.AppErrorColor
        : Assets.Styles.AppPrimaryColor;
    return (
      <View style={styles.priceChangeContainer}>
        <Text.Callout style={{ textAlign: "right" }}>
          {StringUtils.toCurrencyString("3150000")}
        </Text.Callout>
        <Text.Callout style={{ color: negative, textAlign: "right" }}>
          {negative ? "-" : "+"}15.3%
        </Text.Callout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 14,
    marginBottom: 20
  },

  priceChangeContainer: {
    flexDirection: "column",
    justifyContent: "space-between"
  }
});
