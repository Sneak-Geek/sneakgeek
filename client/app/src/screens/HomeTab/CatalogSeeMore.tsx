import React from 'react';
import {Shoe} from 'business';
import {FlatList} from 'react-native';
import {LiteShoeCard} from 'screens/Shared';
import {RootStackParams} from 'navigations/RootStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';

export const CatalogSeeMore = (props: {
  route: RouteProp<RootStackParams, 'CatalogSeeMore'>;
  navigation: StackNavigationProp<RootStackParams, 'CatalogSeeMore'>;
}): JSX.Element => {
  const catalog = props.route.params.catalog;
  const toProductDetail = (item: Shoe) => {
    props.navigation.navigate(RouteNames.Product.Name, {
      screen: RouteNames.Product.ProductDetail,
      params: {shoe: item},
    });
  };
  return (
    <FlatList
      data={catalog.products}
      keyExtractor={(itm) => itm._id}
      renderItem={({item}) => (
        <LiteShoeCard shoe={item} onPress={() => toProductDetail(item)} />
      )}
      style={{flex: 1, backgroundColor: 'white'}}
      numColumns={2}
    />
  );
};
