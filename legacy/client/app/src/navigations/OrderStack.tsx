import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RouteNames from './RouteNames';
import {NewSellOrder} from 'screens/Order/NewSellOrder';
import {NewBuyOrder} from 'screens/Order/NewBuyOrder';
import {strings, themes} from 'resources';

const Stack = createStackNavigator();

export const OrderStack = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name={RouteNames.Order.NewSellOrder}
      component={NewSellOrder}
      options={{
        headerShown: true,
        title: strings.NewSell,
        ...themes.headerStyle,
      }}
    />
    <Stack.Screen
      name={RouteNames.Order.NewBuyOrder}
      component={NewBuyOrder}
      options={{
        headerTransparent: true,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
