// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import * as StringUtil from "../../../Utilities/StringUtil";
import { Transaction } from "../../../Shared/Model";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Assets from "../../../Assets";
import ImagePicker, { ImagePickerResponse } from "react-native-image-picker";
import { Text } from "../../../Shared/UI";

interface Props {
  orderSummary: Transaction;
  onShoePictureAdded: (picUrl: string) => void;
}

interface State {
  pictures: Array<string | null>;
}

export class ShoeSellOrderSummaryComponent extends React.PureComponent<Props, State> {
  public state = {
    pictures: [null]
  };

  private readonly imagePickerOptions = {
    title: "Upload images",
    storageOptions: {
      skipBackup: true,
      path: "images"
    }
  };

  public /** override */ render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1, width: Dimensions.get("screen").width }}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {this._renderPriceSummary()}
          {this._renderDescription()}
          {this._renderSellDuration()}
          {this._renderPictures()}
        </View>
      </ScrollView>
    );
  }

  private _renderPriceSummary(): JSX.Element {
    const price = this.props.orderSummary.currentPrice ? this.props.orderSummary.currentPrice.toString() : "";

    return (
      <View style={styles.sectionContainer}>
        <Text.Subhead>Giá bán</Text.Subhead>
        <Text.Body style={styles.detail}>VND {StringUtil.toCurrencyString(price)}</Text.Body>
      </View>
    );
  }

  private _renderDescription(): JSX.Element {
    const { orderSummary } = this.props;
    return (
      <View style={styles.sectionContainer}>
        <Text.Subhead>Miêu tả</Text.Subhead>
        <Text.Body style={styles.detail}>
          Cỡ {orderSummary.shoeSize}, {orderSummary.shoeCondition}, {orderSummary.boxCondition}
        </Text.Body>
      </View>
    );
  }

  private _renderSellDuration(): JSX.Element | null {
    const { orderSummary } = this.props;
    const { sellDuration } = orderSummary;

    if (!sellDuration) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text.Subhead>Thời gian đăng sản phẩm</Text.Subhead>
        <Text.Body style={styles.detail}>
          {sellDuration.duration} {sellDuration.unit}
        </Text.Body>
      </View>
    );
  }

  private _renderPictures(): JSX.Element {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text.Subhead>Ảnh sản phẩm</Text.Subhead>
        <ScrollView style={{ flex: 1, marginTop: 12 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {this.state.pictures.map((item, index) => {
              if (!item) {
                return this._renderImagePicker(index);
              }

              return this._renderPicture(item, index);
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  private _renderImagePicker(index: number): JSX.Element {
    return (
      <TouchableOpacity
        key={index}
        style={{ backgroundColor: "#C4C4C4", ...styles.imageContainer }}
        onPress={this._launchSystemImagePicker.bind(this)}
      >
        <Image source={Assets.Icons.AddPicture} />
      </TouchableOpacity>
    );
  }

  private _launchSystemImagePicker(): void {
    ImagePicker.launchImageLibrary(this.imagePickerOptions, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.error) {
        this.setState(prevState => {
          this.props.onShoePictureAdded(response.uri);

          return {
            pictures: [...prevState.pictures, response.uri]
          };
        });
      }
    });
  }

  private _renderPicture(pictureUri: string | null, index: number) {
    pictureUri = pictureUri as string;

    return <Image key={index} source={{ uri: pictureUri }} style={styles.imageContainer} resizeMode={"cover"} />;
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 30
  },

  detail: {
    color: "#1ABC9C",
    marginTop: 10
  },

  imageContainer: {
    width: 93,
    aspectRatio: 1,
    marginRight: 12
  }
});
