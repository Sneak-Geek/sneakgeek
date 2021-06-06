//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input } from "react-native-elements";

export default class DebugDialog extends React.PureComponent<{}, { ipAddress: string }> {
  private static DebugIP: string = "";

  public static get debuggerIP() {
    return this.DebugIP;
  }

  public static set debuggerIP(value: string) {
    this.DebugIP = value;
  }

  public constructor(props: any) {
    super(props);
    this.state = {
      ipAddress: DebugDialog.DebugIP
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Debug dialog</Text>
        <Input
          autoCapitalize={"none"}
          placeholder={"Server IP"}
          onChangeText={text => {
            DebugDialog.debuggerIP = text;
            this.setState({
              ipAddress: text
            });
          }}
          value={this.state.ipAddress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 150,
    marginHorizontal: 20,
    backgroundColor: "white"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginVertical: 15
  }
});
