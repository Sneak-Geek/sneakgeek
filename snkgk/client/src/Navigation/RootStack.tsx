import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import RouteNames from './RouteNames';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ShoeDetailScreen from '../Components/ShoeDetail/ShoeDetailScreen';
import BuyScreen from '../Components/Buy/BuyScreen';
import SellScreen from '../Components/Sell/SellScreen';
import {Shoes} from '../Model/Shoes';
import ThemeContext from '../Context/ThemeContext';
import Strings from '../Common/Strings';

export type RootStackParams = {
  Auth: undefined;
  Tab: undefined;
  ShoeDetail: {shoes: Shoes};
  BuyScreen: undefined;
  SellScreen: undefined;
};

const RootStack = createStackNavigator();

const RootNavigator: React.FC<{}> = () => (
  <ThemeContext.Consumer>
    {(theme) => (
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={RouteNames.Tab}>
          <RootStack.Screen name={RouteNames.Auth} component={AuthNavigator} />
          <RootStack.Screen
            name={RouteNames.Tab}
            component={TabNavigator}
            options={{
              header: () => null,
            }}
          />
          <RootStack.Screen
            name={RouteNames.ShoesDetail}
            component={ShoeDetailScreen}
            options={{
              headerBackTitleVisible: false,
              title: Strings.Detail,
              headerTitleStyle: theme.text.title3,
              headerBackTitleStyle: {color: theme.color.brandColorPrimary},
            }}
          />
          <RootStack.Screen name={RouteNames.Buy} component={BuyScreen} />
          <RootStack.Screen name={RouteNames.Sell} component={SellScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    )}
  </ThemeContext.Consumer>
);

export default RootNavigator;
