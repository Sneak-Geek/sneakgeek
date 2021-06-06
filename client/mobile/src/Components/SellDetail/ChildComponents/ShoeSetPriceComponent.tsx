//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { ScrollView, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from "react-native";
import { LineChart, Grid, YAxis } from "react-native-svg-charts";
import { StringUtils } from "../../../Utilities";
import { CustomPicker, Text } from "../../../Shared/UI";
import { container, Types } from "../../../Config/Inversify";
import { IAppSettingsService } from "../../../Service/AppSettingsService";
import { FeatureGates } from "../../../Config/FeatureGates";

interface State {
  isModalOpen: boolean;
  selectedDuration?: string;
  shoePrice: string;
}

interface Props {
  onSetShoePrice: (price: number) => void;
  onSetSellDuration: (sellDuration: { duration: number; unit: string }) => void;
}

export class ShoeSetPriceComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
      shoePrice: ""
    };
  }

  public /** override */ render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1, width: Dimensions.get("screen").width }}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {this._renderPickerModal()}
          {this._renderSetPrice()}
          {FeatureGates.EnablePriceChart && this._renderPriceChart()}
          {this._renderPriceLoHi()}
          {this._renderSellDuration()}
        </View>
      </ScrollView>
    );
  }

  private _renderSetPrice(): JSX.Element {
    return (
      <View style={[styles.rowSeparatedContainer, { marginVertical: 15 }]}>
        <Text.Headline style={{ textAlignVertical: "center" }}>Đặt giá bán</Text.Headline>
        <View style={styles.rowSeparatedContainer}>
          <TextInput
            keyboardType={"numeric"}
            onChangeText={text =>
              this.setState({
                shoePrice: text
              })
            }
            value={this.state.shoePrice}
            onEndEditing={() => {
              const shoePrice = this.state.shoePrice;
              this.props.onSetShoePrice(parseInt(shoePrice));
              this.setState({
                shoePrice: StringUtils.toCurrencyString(shoePrice)
              });
            }}
            onFocus={() => {
              this.setState({ shoePrice: "" });
            }}
            placeholder={StringUtils.toCurrencyString("1000000")}
            style={{ marginLeft: 5, ...Text.TextStyle.body }}
          />
        </View>
      </View>
    );
  }

  private _renderPriceChart(): JSX.Element | null {
    const data = [50, 40, 95, 85, 100];
    const contentInset = { top: 20, bottom: 20 };

    return (
      <View style={{ height: 200, flexDirection: "row" }}>
        <YAxis
          data={data}
          contentInset={contentInset}
          svg={{
            fill: "grey",
            fontSize: 10
          }}
          numberOfTicks={5}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={data}
          svg={{ stroke: "#1ABC9C", strokeWidth: 3, strokeLinecap: "round" }}
          contentInset={contentInset}
          numberOfTicks={5}
        >
          <Grid />
        </LineChart>
      </View>
    );
  }

  private _renderPriceLoHi(): JSX.Element {
    return (
      <View style={[styles.rowSeparatedContainer, { marginVertical: 15 }]}>
        <View>
          <Text.Subhead>Giá thấp nhất</Text.Subhead>
          <Text.Headline>{StringUtils.toCurrencyString("1200000")}</Text.Headline>
        </View>
        <View>
          <Text.Subhead style={{ textAlign: "right" }}>Giá cao nhất</Text.Subhead>
          <Text.Headline>{StringUtils.toCurrencyString("1800000")}</Text.Headline>
        </View>
      </View>
    );
  }

  private _renderSellDuration(): JSX.Element {
    return (
      <View style={[styles.rowSeparatedContainer, { marginVertical: 15 }]}>
        <Text.Headline>Thời gian đăng</Text.Headline>
        <TouchableOpacity onPress={() => this.setState({ isModalOpen: true })}>
          <Text.Body style={styles.textPicker}>{this.state.selectedDuration || "Lựa chọn"}</Text.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _renderPickerModal() {
    const settings = container.get<IAppSettingsService>(Types.IAppSettingsService).getSettings().RemoteSettings;

    const options = settings ? settings.sellDuration : [];

    return (
      <CustomPicker
        visible={this.state.isModalOpen}
        options={options.map(t => `${t.duration} ${t.unit}`)}
        optionLabelToString={item => item}
        onSelectPickerOK={(selectedValue: string) => {
          this.setState({ selectedDuration: selectedValue, isModalOpen: false }, () => {
            const [duration, unit] = selectedValue.split(" ");
            this.props.onSetSellDuration({ duration: parseInt(duration, 10), unit });
          });
        }}
        onSelectPickerCancel={() => this.setState({ isModalOpen: false })}
      />
    );
  }
}

const styles = StyleSheet.create({
  rowSeparatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  fontSubtitle: {
    fontSize: 16,
    color: "rgba(0.0, 0.0, 0.0, 0.6)"
  },

  textPicker: {
    color: "#1ABC9C"
  },

  modalContainer: {
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.3)",
    flex: 1,
    position: "relative"
  },

  pickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent"
  }
});
