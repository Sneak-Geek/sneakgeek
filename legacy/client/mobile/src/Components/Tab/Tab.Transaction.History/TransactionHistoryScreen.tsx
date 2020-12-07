//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Image, StatusBar } from "react-native";
import { TransactionShoeCard } from "../../../Shared/UI";
import * as Assets from "../../../Assets";

export class TransactionHistoryScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: "Lịch sử"
  };

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <ScrollView>
          <View style={styles.topContainer}>
            <Text style={styles.title}>Lịch sử giao dịch</Text>
            <Image source={Assets.Icons.Hamburger} style={{ width: 20, height: 20, resizeMode: "contain" }} />
          </View>
          <TransactionShoeCard
            mode="history"
            name="Adidas Pharell NMD Human Adidas Pharell NMD Human Adidas Pharell NMD Human Adidas Pharell NMD Human"
          />
          <TransactionShoeCard
            mode="history"
            name="Adidas Pharell NMD Human Adidas Pharell NMD Human Adidas Pharell NMD Human Adidas Pharell NMD Human"
          />
          <TransactionShoeCard
            mode="history"
            name="Adidas Pharell NMD Human Adidas Pharell NMD Human Adidas Pharell NMD Human Adidas Pharell NMD Human"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  title: {
    fontSize: 22,
    fontFamily: "RobotoCondensed-Regular"
  },
  line: {
    height: 0.3,
    backgroundColor: "#BCBBC1",
    marginHorizontal: 20
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingLeft: 14,
    paddingRight: 20
  }
});
