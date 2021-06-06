//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, ScrollView, SafeAreaView, FlatList } from "react-native";
import { Shoe } from "../../../Shared/Model";
import { ShoeProgressCircle } from "../../../Shared/UI";
import PurchaseComponent from "../PurchaseComponent";

export interface IBuyScreenProps {
  shoes: Shoe[];
}

export default class TabBuyMainScreen extends PurchaseComponent<IBuyScreenProps> {
  static navigationOptions = {
    header: null
  };

  public render(): React.ReactNode {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          {this._renderCurrentBid()}
          {this._renderFollowing()}
          {this._renderBuyerHistory()}
        </SafeAreaView>
      </ScrollView>
    );
  }

  private _renderCurrentBid(): React.ReactNode {
    const shoes = this.props.shoes.length > 0 ? this.props.shoes.slice(16, 22) : [];
    return (
      <View>
        {this.renderTitleWithSeeMore("Đang đấu giá")}
        <FlatList
          data={shoes}
          keyExtractor={item => item.title}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 20 }}
          renderItem={({ item, index }) => (
            <ShoeProgressCircle
              shoe={item}
              shoeData={{ isDropped: index % 2 === 0, percent: index * 10 }}
            />
          )}
        />
      </View>
    );
  }

  private _renderFollowing(): React.ReactNode {
    const shoes = this.props.shoes.length > 0 ? this.props.shoes.slice(23, 27) : [];
    return this.renderShoesList("Theo dõi", shoes, false);
  }

  private _renderBuyerHistory(): React.ReactNode {
    const shoes = this.props.shoes.length > 0 ? this.props.shoes.slice(100, 104) : [];
    return this.renderShoesList("Lịch sử mua", shoes, true);
  }
}
