//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Assets from "../../Assets";
import { connect } from "react-redux";
import { bootstrap } from "../../Actions";

export class SplashScreen extends React.Component<{ bootstrap: () => void }> {
  static navigationOptions = {
    header: null
  };

  public /** override */ componentDidMount() {
    this.props.bootstrap();
  }

  public /** override */ render(): JSX.Element {
    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Assets.Styles.AppAccentColor,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapDispatchToProps = (dispatch: Function) => {
  return {
    bootstrap: () => {
      dispatch(bootstrap());
    }
  };
};

export const SplashScreenContainer = connect(
  null,
  mapDispatchToProps
)(SplashScreen);
