import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import RouteNames from './RouteNames';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ShoeDetailScreen from '../Components/ShoeDetail/ShoeDetailScreen';
import BuyScreen from '../Components/Buy/BuyScreen';
import SellScreen from '../Components/Sell/SellScreen';

const RootStack = createStackNavigator();

const RootNavigator: React.FC<{}> = () => (
  <NavigationContainer>
    <RootStack.Navigator headerMode={'none'} initialRouteName={RouteNames.Tab}>
      <RootStack.Screen name={RouteNames.Auth} component={AuthNavigator} />
      <RootStack.Screen name={RouteNames.Tab} component={TabNavigator} />
      <RootStack.Screen
        name={RouteNames.ShoeDetail}
        component={ShoeDetailScreen}
      />
      <RootStack.Screen name={RouteNames.Buy} component={BuyScreen} />
      <RootStack.Screen name={RouteNames.Sell} component={SellScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
