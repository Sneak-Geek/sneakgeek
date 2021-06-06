//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Shoe } from "../../../Shared/Model";
import { HorizontalShoeCard, Text } from "../../../Shared/UI";

export default class PurchaseComponents<P = {}, S = {}> extends React.Component<P, S> {
  public /** abstract */ render(): React.ReactNode {
    return null;
  }

  constructor(props: P) {
    super(props);
  }

  public renderShoesList(title: string, shoes: Shoe[], renderPriceOnly: boolean) {
    return (
      <View>
        {this.renderTitleWithSeeMore(title)}
        <FlatList
          data={shoes}
          keyExtractor={shoe => shoe.title}
          style={{ marginVertical: 20 }}
          renderItem={({ item }) => (
            <HorizontalShoeCard shoe={item} renderPriceOnly={renderPriceOnly} />
          )}
        />
      </View>
    );
  }

  public renderTitleWithSeeMore(title: string): React.ReactNode {
    return (
      <View style={styles.titleContainer}>
        <Text.Title2>{title}</Text.Title2>
        <Text.Subhead>xem thêm</Text.Subhead>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 14
  }
});
