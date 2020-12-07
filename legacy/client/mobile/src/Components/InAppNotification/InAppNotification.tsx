//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Text } from "../../Shared/UI";
import * as Assets from "../../Assets";
import { FlatList } from "react-native-gesture-handler";

export interface InAppNotificationProps {
  notifications: { id: string; message: string; timeout: number }[];
  dismissNotification: (id: string) => void;
}

export class InAppNotification extends React.Component<InAppNotificationProps> {
  private timeouts: NodeJS.Timeout[] = [];

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView>
        <View>
          <FlatList
            style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            keyExtractor={(_itm, idx) => idx.toString()}
            data={this.props.notifications}
            renderItem={({ item }) => {
              const timeout = setTimeout(() => {
                this.props.dismissNotification(item.id);
                clearTimeout(timeout);
              }, item.timeout * 1000);
              this.timeouts.push(timeout);

              return (
                <View style={styles.toastContainer}>
                  <Text.Footnote style={{ color: Assets.Styles.AppPrimaryColor }}>{item.message}</Text.Footnote>
                  <TouchableOpacity onPress={() => this.props.dismissNotification(item.id)}>
                    <Text.Footnote style={{ color: "white" }}>Đóng</Text.Footnote>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  public /** override */ componentWillUnmount() {
    this.timeouts.forEach(t => clearTimeout(t));
  }
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    backgroundColor: "#000000",
    width: "100%",
    height: 32,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20
  }
});
