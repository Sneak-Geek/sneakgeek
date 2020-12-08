import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RouteNames from './RouteNames';
import {themes, strings, images} from 'resources';
import {Icon} from 'react-native-elements';
import {
  AccountTabMain,
  AccountTabEditProfile,
  AccountTabFaq,
  AccountTabPaymentInfo,
} from 'screens/AccountTab';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {HomeTabMain} from 'screens/HomeTab/HomeTabMain';
import {SearchTabMain} from 'screens/SearchTab/SearchTabMain';
import {Image} from 'react-native';
import {
  ObjectFactory as Factory,
  ISettingsProvider,
  FactoryKeys as Keys,
  getNotification,
} from 'business';
import {CatalogSeeMore, NotificationsScreen} from 'screens/HomeTab';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SellOrderHistory, OrderDetail, BuyOrders} from 'screens/TransactionTab';
import {ProductRequest} from 'screens/SearchTab';
import {getDependency, getToken, connect} from 'utilities';
import {KeyExtensions} from 'common';
import {IAppState} from 'store/AppStore';
import {RootStackParams} from './RootStack';

const Tab = createBottomTabNavigator();

const TabBarIcon = (name: string) => ({color, size}): JSX.Element => (
  <Icon name={name} size={size} color={color} />
);

const AccountStack = createStackNavigator();
const AccountTab = (): JSX.Element => (
  <AccountStack.Navigator>
    <AccountStack.Screen
      name={RouteNames.Tab.AccountTab.Main}
      component={AccountTabMain}
      options={{
        title: 'Tài khoản',
        ...themes.headerStyle,
      }}
    />
    <AccountStack.Screen
      name={RouteNames.Tab.AccountTab.EditProfile}
      component={AccountTabEditProfile}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
    />
    <AccountStack.Screen
      name={RouteNames.Tab.AccountTab.Faq}
      component={AccountTabFaq}
      options={{
        ...themes.headerStyle,
        title: strings.InfoAppSetting,
      }}
    />
    <AccountStack.Screen
      name={RouteNames.Tab.AccountTab.PaymentInfo}
      component={AccountTabPaymentInfo}
      options={{
        title: strings.PaymentInfo,
        ...themes.headerStyle,
      }}
    />
  </AccountStack.Navigator>
);

const HomeStack = createStackNavigator();
type HomeTabProps = {
  navigation: StackNavigationProp<RootStackParams, 'HomeTab'>;
  notificationCount: number;
};

@connect((state: IAppState) => ({
  notificationCount: state.AppNotificationState.notifications.length,
}))
class HomeTab extends React.Component<HomeTabProps> {
  public render(): JSX.Element {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name={RouteNames.Tab.HomeTab.Main}
          component={HomeTabMain}
          options={{
            ...themes.headerStyle,
            title: strings.HomeTabTitle,
            headerLeft: () => (
              <Image
                source={images.Logo}
                style={{
                  width: themes.IconSize * 1.75,
                  height: themes.IconSize * 1.75,
                  marginLeft: 3,
                }}
              />
            )
          }}
        />
        <HomeStack.Screen
          name={RouteNames.Tab.HomeTab.SeeMore}
          component={CatalogSeeMore}
          options={{
            title: strings.SeeMore,
            ...themes.headerStyle,
          }}
        />
        <HomeStack.Screen
          name={RouteNames.Tab.HomeTab.Notification}
          component={NotificationsScreen}
          options={{
            title: strings.Notification,
            ...themes.headerStyle,
          }}
        />
      </HomeStack.Navigator>
    );
  }
}

const SearchStack = createStackNavigator();
const SearchTab = (): JSX.Element => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name={RouteNames.Tab.SearchTab.Main}
      component={SearchTabMain}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
    />
    <SearchStack.Screen
      name={RouteNames.Tab.SearchTab.ProductRequest}
      component={ProductRequest}
      options={{
        ...themes.headerStyle,
        title: strings.RequestNewProduct,
      }}
    />
  </SearchStack.Navigator>
);

const TopTab = createMaterialTopTabNavigator();

const TransactionTopTabs = (): JSX.Element => (
  <TopTab.Navigator tabBarOptions={themes.TabTopHeader}>
    <TopTab.Screen
      component={BuyOrders}
      name={RouteNames.Tab.TransactionTab.Buy}
      options={{
        title: strings.BuyHistory,
      }}
    />
    <TopTab.Screen
      component={SellOrderHistory}
      name={RouteNames.Tab.TransactionTab.SellOrderHistory}
      options={{
        title: strings.SellHistory,
      }}
    />
  </TopTab.Navigator>
);

const TransactionStack = createStackNavigator();
const TransactionTab = (): JSX.Element => (
  <TransactionStack.Navigator>
    <TransactionStack.Screen
      name={RouteNames.Tab.TransactionTab.Main}
      component={TransactionTopTabs}
      options={{
        ...themes.headerStyle,
        title: strings.TransactionTab,
      }}
    />
    <TransactionStack.Screen
      name={RouteNames.Tab.TransactionTab.Detail}
      component={OrderDetail}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
    />
  </TransactionStack.Navigator>
);

type RootTabProps = {
  pushDeviceToken: string;
  getNotifications: () => void;
};

@connect(
  (state: IAppState) => ({
    pushDeviceToken: state.EnvironmentState.pushDeviceToken,
  }),
  (dispatch: Function) => ({
    getNotifications: () => {
      dispatch(getNotification());
    },
  }),
)
export class TabStack extends React.Component<RootTabProps> {

  public componentDidMount() {
    const settingsProvider = Factory.getObjectInstance<ISettingsProvider>(
      Keys.ISettingsProvider,
    );
    settingsProvider.loadServerSettings();

    // Get notifications
    this.props.getNotifications();
  }

  public render() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: themes.TextStyle.footnoteRegular,
          activeTintColor: themes.AppPrimaryColor,
          inactiveTintColor: themes.AppDisabledColor,
        }}>
        <Tab.Screen
          name={RouteNames.Tab.HomeTab.Name}
          component={HomeTab}
          options={{
            tabBarIcon: TabBarIcon('home'),
            title: strings.HomeTab,
          }}
        />
        <Tab.Screen
          name={RouteNames.Tab.SearchTab.Name}
          component={SearchTab}
          options={{
            tabBarIcon: TabBarIcon('search'),
            title: strings.SearchTab,
          }}
        />
        <Tab.Screen
          name={RouteNames.Tab.AccountTab.Name}
          component={AccountTab}
          options={{
            tabBarIcon: TabBarIcon('person'),
            title: strings.UserTab,
          }}
        />
      </Tab.Navigator>
    );
  }
}
