import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RouteNames from './RouteNames';
import {ProductDetail, AllReviews, NewReview} from 'screens/Product';
import {themes, strings} from 'resources';

const Stack = createStackNavigator();

export const ProductStack = (): JSX.Element => (
  <Stack.Navigator initialRouteName={RouteNames.Product.ProductDetail}>
    <Stack.Screen
      name={RouteNames.Product.ProductDetail}
      component={ProductDetail}
      options={{
        headerTransparent: true,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={RouteNames.Product.AllReviews}
      component={AllReviews}
      options={{
        headerTransparent: true,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={RouteNames.Product.NewReview}
      component={NewReview}
      options={{
        ...themes.headerStyle,
        title: strings.NewReview,
      }}
    />
  </Stack.Navigator>
);
