//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from "react";
import { SafeAreaView, View, TextInput, Dimensions, StyleSheet } from "react-native";
import { LiteCreditCardInput } from "react-native-credit-card-input";
import { Text } from "../../Shared/UI";
import * as Assets from "../../Assets";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackActions, ScreenProps } from "react-navigation";
import { Icon } from "react-native-elements";

export class AddCardScreen extends React.Component {
  public static navigationOptions = (navigationConfig: ScreenProps) => ({
    title: "Thêm thẻ",
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
      <SafeAreaView style={{ flex: 1, position: "relative" }}>
        <View style={styles.rootContainer}>
          {this._renderCardInfo()}
          {this._renderOwner()}
          {this._renderZipcode()}
          {this._renderConfirmButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderCardInfo(): JSX.Element {
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        <Text.Callout>Số thẻ</Text.Callout>
        <View style={styles.cardContainer}>
          <LiteCreditCardInput
            onChange={this._onCreditCardInfoChange.bind(this)}
            inputStyle={Text.TextStyle.body}
            placeholders={{ number: "xxxx xxxx xxxx xxxx", expiry: "MM/YY", cvc: "CVC" }}
          />
        </View>
      </View>
    );
  }

  private _renderOwner(): JSX.Element {
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        <Text.Callout>Tên chủ thẻ</Text.Callout>
        <TextInput placeholder={"e.g. Nguyễn Văn A"} style={styles.textInput} />
      </View>
    );
  }

  private _renderZipcode(): JSX.Element {
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        <Text.Callout>Mã bưu điện</Text.Callout>
        <TextInput placeholder={"e.g. 10000"} keyboardType={"number-pad"} style={styles.textInput} />
      </View>
    );
  }

  private _renderConfirmButton(): JSX.Element {
    return (
      <View style={styles.confirmButton}>
        <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
          <Text.Body style={{ color: Assets.Styles.TextSecondaryColor, textAlign: "center" }}>Xác nhận</Text.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _onCreditCardInfoChange(form: any) {
    console.log(form);
  }
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, flexDirection: "column", paddingTop: 20 },

  cardContainer: {
    backgroundColor: Assets.Styles.ListItemBackgroundColor,
    marginTop: 10,
    height: Assets.Styles.ButtonHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Assets.Styles.ButtonBorderRadius
  },

  textInput: {
    backgroundColor: Assets.Styles.ListItemBackgroundColor,
    height: Assets.Styles.ButtonHeight,
    marginTop: 10,
    paddingLeft: 10,
    borderRadius: Assets.Styles.ButtonBorderRadius,
    ...Text.TextStyle.body
  },

  confirmButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    width: Dimensions.get("window").width,
    height: Assets.Styles.ButtonHeight,
    alignItems: "center",
    justifyContent: "center"
  }
});
