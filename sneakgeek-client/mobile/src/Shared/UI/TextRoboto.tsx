//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { Text, ViewStyle } from "react-native";

interface ITextRobotoProps {
  style: ViewStyle;
}

export default class TextRoboto extends React.Component<ITextRobotoProps> {
  render() {
    const { children, style, ...otherProps } = this.props;
    return (
      <Text {...otherProps} style={[style, { fontFamily: "roboto" }]}>
        {this.props.children}
      </Text>
    );
  }
}
