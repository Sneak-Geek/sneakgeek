//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import * as Assets from "../../Assets";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  title?: string;
  description?: string;
  border?: boolean;
  green?: boolean;
  descriptionStyle?: any;
  onPress?: () => void;
  buttonTitle?: string;
  value?: string;
}

export class RowCard extends React.Component<Props, {}> {
  render() {
    let {
      title,
      description: descrip,
      border,
      green,
      descriptionStyle: descripStyle,
      onPress,
      buttonTitle,
      value
    } = this.props;
    return (
      <View style={border ? styles.rowBorder : styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.boldText}>{title}</Text>
        </View>
        {onPress ? (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
          >
            <Text
              style={[
                value ? styles.regularTextGreen : styles.regularText,
                { opacity: value ? 1 : 0.3 }
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {value ? value : buttonTitle}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }}>
            <Text
              style={[green ? styles.regularTextGreen : styles.regularText, descripStyle]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {descrip}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 30
  },
  rowBorder: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 30,
    borderBottomWidth: 1,
    borderColor: "#BCBBC1",
    paddingBottom: 20
  },
  boldText: {
    opacity: 0.6,
    fontSize: 14,
    fontFamily: "RobotoCondensed-Bold"
  },
  regularText: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    textAlign: "right"
  },
  regularTextGreen: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Regular",
    textAlign: "right",
    color: Assets.Styles.AppPrimaryColor
  }
});
