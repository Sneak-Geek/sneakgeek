import React from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Inventory, Shoe } from "business/src";
import RouteNames from "navigations/RouteNames";
import { FlatList } from "react-native";
import { LiteShoeCard } from "screens/Shared";

export const SeeMore: React.FC<{}> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const inventories: Inventory[] = (route.params as any).inventories;

  return (
    <FlatList
      data={inventories}
      keyExtractor={(inventory: Inventory) => inventory.shoe._id}
      renderItem={({ item }) => (
        <LiteShoeCard shoe={item.shoe} price={item.sellPrice} onPress={() => {
          navigation.navigate(RouteNames.Product.Name, { shoe: item.shoe });
        }} />
      )}
      style={{ flex: 1, backgroundColor: 'white' }}
      numColumns={2}
    />
  )
}