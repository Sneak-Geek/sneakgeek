//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { ViewStyle, View, TouchableOpacity, TextStyle, StyleSheet } from "react-native";
import { Text } from ".";

interface Props {
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  onPress?: () => void;
  title?: string;
}

export class AppButton extends React.PureComponent<Props> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[this.props.containerStyle, styles.border]}>
          <Text.Subhead style={this.props.textStyle}>{this.props.title}</Text.Subhead>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: "black"
  }
});
