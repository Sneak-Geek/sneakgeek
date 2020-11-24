//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Text } from "../../Shared/UI";
import { StackActions, FlatList } from "react-navigation";
import { RouteNames } from "../../Navigation";
import * as Assets from "../../Assets";
// import { container, Types } from "../../Config/Inversify";
// import { IAppSettingsService } from "../../Service/AppSettingsService";
// import { Ico } from "react-native-elements";

export class OnboardingScreen extends React.Component<{}> {
  static navigationOptions = ({ navigation }: any) => ({
    title: "Bắt đầu",
    headerTitleStyle: Text.TextStyle.title2,
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() =>
          navigation.dispatch(
            StackActions.replace({
              routeName: RouteNames.Tabs.TabRoot
            })
          )
        }
      >
        <Text.Subhead>Bỏ qua</Text.Subhead>
      </TouchableOpacity>
    )
  });

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this._renderGenderSelector()}
          {this._renderBrandSelector()}
          {this._renderSizeStandardSelector()}
          {this._renderSizeSelector()}
          {this._renderBottomButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderSelectorTemplate<T>(
    header: string,
    data: Array<T>,
    renderDataItem: (item: T) => JSX.Element
  ) {
    return (
      <View>
        <Text.Subhead style={{ marginHorizontal: 20, marginVertical: 10 }}>
          {header.toUpperCase()}
        </Text.Subhead>
        <FlatList
          style={{ backgroundColor: "gainsboro", paddingVertical: 25 }}
          keyExtractor={(_itm, idx) => idx.toString()}
          data={data}
          renderItem={({ item }) => renderDataItem(item)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  private _renderGenderSelector() {
    const genders = ["Nam", "Nữ", "Trẻ em"].map(t => t.toUpperCase());
    const renderGender = (gender: string) => (
      <Text.Body style={{ marginHorizontal: 30 }}>{gender}</Text.Body>
    );
    return this._renderSelectorTemplate("Giới tính", genders, renderGender);
  }

  private _renderBrandSelector() {}

  private _renderSizeStandardSelector() {
    const standards = ["US", "UK", "EU"];
    const renderStandard = (standard: string) => (
      <Text.Body style={{ marginHorizontal: 30 }}>{standard}</Text.Body>
    );

    return this._renderSelectorTemplate("Tiêu chuẩn size", standards, renderStandard);
  }

  private _renderSizeSelector() {
    const shoeSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const renderShoeSize = (shoeSize: string) => (
      <Text.Body style={{ marginHorizontal: 30 }}>{shoeSize}</Text.Body>
    );

    return this._renderSelectorTemplate("Cỡ giày", shoeSizes, renderShoeSize);
  }

  private _renderBottomButton() {
    return (
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: Assets.Styles.ButtonHeight,
          backgroundColor: Assets.Styles.ButtonPrimaryColor,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text.Body style={{ color: Assets.Styles.TextSecondaryColor }}>Xác nhận</Text.Body>
      </TouchableOpacity>
    );
  }
}
