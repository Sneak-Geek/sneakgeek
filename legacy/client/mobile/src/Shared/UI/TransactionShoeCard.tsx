//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as Assets from "../../Assets";
import { Text } from ".";

interface Props {
  // shoe: Shoe;
  // renderPriceOnly?: boolean;
  name?: string;
  mode: "buy" | "sell" | "history";
  onPress?: () => void;
}

export class TransactionShoeCard extends React.Component<Props, {}> {
  render() {
    // const { shoe, renderPriceOnly } = this.props;
    const { mode } = this.props;
    return (
      <View>
        {mode === "buy" && this._renderBuy()}
        {mode === "sell" && this._renderSell()}
        {mode === "history" && this._renderHistory()}
      </View>
    );
  }

  private _renderBuy() {
    const { name } = this.props;
    return (
      <TouchableOpacity style={styles.container} activeOpacity={0.7}>
        <Image
          style={styles.image}
          source={{
            uri:
              "https://www.flightclub.com/media/catalog/product/cache/1/image/1600x1140/9df78eab33525d08d6e5fb8d27136e95/2/0/201357_01.jpg"
          }}
        />
        <View style={{ flex: 1, paddingTop: 30 }}>
          <View style={styles.row}>
            <View>
              <Text.Subhead style={styles.title}>Ngày đặt giá</Text.Subhead>
              <Text.Body>12/02/2019</Text.Body>
            </View>
            <View>
              <Text.Subhead style={[styles.title, { textAlign: "right" }]}>
                Giá mua
              </Text.Subhead>
              <Text.Body style={[styles.price, { textAlign: "right", color: "#FF2D55" }]}>
                VND 1.800.000
              </Text.Body>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            <View>
              <Text.Body
                style={[styles.title, { paddingBottom: 6 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {name}
              </Text.Body>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={Assets.Icons.Clock}
                  style={{
                    tintColor: "black",
                    opacity: 0.4,
                    width: 19,
                    height: 19,
                    resizeMode: "contain",
                    marginRight: 3
                  }}
                />
                <Text.Body style={{ opacity: 0.4 }}>18 giờ 8 phút</Text.Body>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private _renderSell() {
    const { name, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
        <Image
          style={styles.image}
          source={{
            uri:
              "https://www.flightclub.com/media/catalog/product/cache/1/image/1600x1140/9df78eab33525d08d6e5fb8d27136e95/2/0/201357_01.jpg"
          }}
        />
        <View style={{ flex: 1, paddingTop: 30 }}>
          <View style={styles.row}>
            <View>
              <Text.Subhead style={styles.title}>Giá đăng</Text.Subhead>
              <Text.Body>VND 1.200.000</Text.Body>
            </View>
            <View>
              <Text.Subhead style={[styles.title, { textAlign: "right" }]}>
                Giá đề nghị
              </Text.Subhead>
              <Text.Body style={[styles.price, { textAlign: "right", color: "#1ABC9C" }]}>
                VND 1.800.000
              </Text.Body>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            <View>
              <Text.Body
                style={[styles.title, { paddingBottom: 6 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {name}
              </Text.Body>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={Assets.Icons.Clock}
                  style={{
                    tintColor: "black",
                    width: 19,
                    height: 19,
                    resizeMode: "contain",
                    marginRight: 3
                  }}
                />
                <Text.Body>18 giờ 8 phút</Text.Body>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private _renderHistory() {
    const { name } = this.props;
    return (
      <TouchableOpacity style={styles.containerHistory}>
        <Image
          style={styles.historyImage}
          source={{
            uri:
              "https://www.flightclub.com/media/catalog/product/cache/1/image/1600x1140/9df78eab33525d08d6e5fb8d27136e95/2/0/201357_01.jpg"
          }}
        />
        <View style={styles.contentHistoryContainer}>
          <View style={{ flex: 2, paddingRight: 11 }}>
            <Text.Body
              style={[{ textAlign: "left" }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {name}
            </Text.Body>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text.Body style={[{ textAlign: "right" }]}>3.111.000</Text.Body>
              <Text.Body style={styles.VND}>đ</Text.Body>
            </View>
            <Text.Body style={[styles.method, { textAlign: "right" }]}>MUA</Text.Body>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderBottomWidth: 0.3,
    borderColor: "#BCBBC1",
    height: 150,
    alignItems: "center"
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginLeft: 4,
    marginRight: 25
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 17
  },
  title: {
    opacity: 0.4
  },

  price: {
    fontSize: 14,
    fontFamily: "RobotoCondensed-Regular"
  },
  method: {
    fontSize: 14,
    fontFamily: "RobotoCondensed-Bold",
    opacity: 0.3
  },
  containerHistory: {
    height: 93,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 20
  },
  historyImage: {
    width: 90,
    height: 47,
    marginRight: 14,
    resizeMode: "contain"
  },
  contentHistoryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  VND: {
    fontSize: 7,
    fontFamily: "RobotoCondensed-Bold"
  }
});
