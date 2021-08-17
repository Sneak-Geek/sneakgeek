import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RouteNames from './RouteNames';
import { AuthenticationStack } from './AuthenticationStack';
import { TabStack } from './TabStack';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import {
  Shoe,
  Catalog,
  PaymentType,
  OrderType,
  Review,
  PopulatedSellOrder,
  PopulatedBuyOrder,
  BuyOrder,
  SellOrder,
} from 'business';
import { OrderStack } from './OrderStack';
import { SplashScreen } from 'screens/SplashScreen';
import { ProductDetail } from 'screens/Product';
import { strings, themes } from 'resources';
import { AccountTabViewProfile, AccountTabEditProfile, AccountTabInventoryDetail } from 'screens/AccountTab';
import { SeeMore } from 'screens/HomeTab';
import { Payment } from 'screens/Order';
import { OrderConfirmation } from 'screens/Order/OrderConfirmation';
import { View } from 'react-native';
import analytics from '@react-native-firebase/analytics';

export type RootStackParams = {
  ProductRequest: undefined;
  ProductDetail: { shoe: Shoe };
  ProductNewReview: { shoe: Shoe };
  ProductAllReviews: { shoe: Shoe; reviews: Review[] };
  SizeSelection: { orderType: OrderType; shoe: Shoe };
  NewSellOrder: {
    shoe: Shoe;
    highestBuyOrder?: BuyOrder;
    lowestSellOrder?: SellOrder;
  };
  NewBuyOrder: {
    shoe: Shoe;
  };
  OrderSizeSelection: { shoe: Shoe };
  OrderBuyConfirmation: { shoe: Shoe; size: string; minPrice: number };
  OrderPayment: {
    inventoryId: string;
    paymentType: PaymentType;
    addressLine1: string;
    addressLine2: string;
  };
  SellOrderHistory: undefined;
  TransactionBuyOrder: undefined;
  OrderDetail: {
    order?: PopulatedSellOrder | PopulatedBuyOrder;
    orderId?: string;
    orderType: OrderType;
  };
  Login: undefined;
  EmailSignUp: undefined;
  EmailLogin: undefined;
  HomeTab: undefined;
  HomeTabMain: undefined;
  CatalogSeeMore: { catalog: Catalog };
  SearchTabMain: undefined;
  TrasactionTabMain: undefined;
  AccountTabMain: undefined;
  AccountTabViewProfile: undefined;
  HomeTabNotification: undefined;
};

const Stack = createStackNavigator();

const RootStack = (): JSX.Element => {
  const routeNameRef = React.useRef<string>();
  const navRef: React.Ref<NavigationContainerRef> = React.useRef();

  return (
    <NavigationContainer ref={navRef}
      onReady={() => routeNameRef.current = navRef.current.getCurrentRoute().name}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator initialRouteName={RouteNames.Splash}>
        <Stack.Screen
          name={RouteNames.Splash}
          component={SplashScreen}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name={RouteNames.Auth.Name}
          component={AuthenticationStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RouteNames.Tab.Name}
          component={TabStack}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RouteNames.Product.Name}
          component={ProductDetail}
          options={{
            title: strings.ProductDetail,
            ...themes.headerStyle,
          }}
        />
        <Stack.Screen
          name={RouteNames.Order.Name}
          component={OrderStack}
          options={{
            gestureEnabled: false,
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
          name={'OrderConfirmation'}
          component={OrderConfirmation}
          options={{
            headerTransparent: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RouteNames.Tab.InventoryTab.InventoryDetail}
          component={AccountTabInventoryDetail}
          options={{
            gestureEnabled: null,
            ...themes.headerStyle,
            title: strings.Inventory,
            headerLeft: () => <View />,
          }}
        />
        <Stack.Screen
          name={RouteNames.Tab.AccountTab.EditProfile}
          component={AccountTabEditProfile}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name={RouteNames.Tab.AccountTab.ViewProfile}
          component={AccountTabViewProfile}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name={RouteNames.Tab.HomeTab.SeeMore}
          component={SeeMore}
          options={{
            title: strings.SeeMore,
            ...themes.headerStyle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
