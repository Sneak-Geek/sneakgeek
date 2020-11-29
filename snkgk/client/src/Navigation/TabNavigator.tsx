import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import RouteNames from './RouteNames';
import HomeScreen from '../Components/Home/HomeScreen';
import Strings from '../Common/Strings';
import SearchScreen from '../Components/Search/SearchScreen';
import UserSettingsScreen from '../Components/Settings/UserSettingsScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = (name: string) => ({color, size}: any): JSX.Element => (
  <Icon name={name} size={size} color={color} />
);

const TabNavigator: React.FC<{}> = () => (
  <Tab.Navigator>
    <Tab.Screen
      name={RouteNames.HomeTab}
      component={HomeScreen}
      options={{
        tabBarIcon: TabBarIcon('home'),
        title: Strings.Home,
      }}
    />
    <Tab.Screen
      name={RouteNames.SearchTab}
      component={SearchScreen}
      options={{
        tabBarIcon: TabBarIcon('search'),
        title: Strings.Search,
      }}
    />
    <Tab.Screen
      name={RouteNames.UserAndSettingTab}
      component={UserSettingsScreen}
      options={{
        tabBarIcon: TabBarIcon('person'),
        title: Strings.User,
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
