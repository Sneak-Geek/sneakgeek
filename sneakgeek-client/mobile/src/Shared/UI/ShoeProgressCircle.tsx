//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { Shoe } from "../../Shared/Model";
import { View, Image } from "react-native";
import ProgressCircle from "react-native-progress-circle";
import { Text } from ".";
import { StringUtils } from "../../Utilities";

interface Props {
  shoe: Shoe;
  shoeData: {
    percent: number;
    isDropped: boolean;
  };
}

export class ShoeProgressCircle extends React.Component<Props, {}> {
  // TODO: Deprecated the use of Progress circle - use react-native-svg-charts
  // since it's using componentWillReceiveProps

  render(): React.ReactNode {
    const { shoe, shoeData } = this.props;
    return (
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ProgressCircle
          percent={shoeData.percent}
          radius={50}
          borderWidth={2}
          color={shoeData.isDropped ? "#1ABC9C" : "#FF2D55"}
          shadowColor={"#DADADA"}
          bgColor={"white"}
          outerCircleStyle={{ marginLeft: 12, marginBottom: 15 }}
        >
          <Image
            source={{ uri: shoe.imageUrl, cache: "default" }}
            style={{ width: 80, aspectRatio: 1 }}
            resizeMode={"contain"}
          />
        </ProgressCircle>
        <Text.Subhead>{StringUtils.toCurrencyString("3150000")}</Text.Subhead>
      </View>
    );
  }
}
