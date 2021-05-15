import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RouteNames from './RouteNames';
import {
  // NewSellOrder,
  SizeSelection,
  BuyConfirmation,
  Payment,
} from 'screens/Order';
import {NewSellOrder} from 'screens/Order/NewSellOrder';
import {NewBuyOrder} from 'screens/Order/NewBuyOrder';
import {strings, themes} from 'resources';
import { OrderConfirmation } from 'screens/Order/OrderConfirmation';

const Stack = createStackNavigator();

export const OrderStack = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name={RouteNames.Order.NewSellOrder}
      component={NewSellOrder}
      options={{
        headerShown: true,
        title: strings.NewSell,
        ...themes.headerStyle
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
    <Stack.Screen
      name={RouteNames.Order.Payment}
      component={Payment}
      options={{
        headerTransparent: true,
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={"OrderConfirmation"}
      component={OrderConfirmation}
      options={{
        headerTransparent: true,
        headerShown: false
      }}
    />
  </Stack.Navigator>
);
