import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RouteNames from './RouteNames';
import {AuthenticationStack} from './AuthenticationStack';
import {TabStack} from './TabStack';
import {NavigationContainer} from '@react-navigation/native';
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
import {OrderStack} from './OrderStack';
import {SplashScreen} from 'screens/SplashScreen';
import {ProductDetail} from 'screens/Product';
import {strings, themes} from 'resources';
import {AccountTabEditProfile} from 'screens/AccountTab';
import {SeeMore} from 'screens/HomeTab';
import {Payment} from 'screens/Order';
import {OrderConfirmation} from 'screens/Order/OrderConfirmation';

export type RootStackParams = {
  ProductRequest: undefined;
  ProductDetail: {shoe: Shoe};
  ProductNewReview: {shoe: Shoe};
  ProductAllReviews: {shoe: Shoe; reviews: Review[]};
  SizeSelection: {orderType: OrderType; shoe: Shoe};
  NewSellOrder: {
    shoe: Shoe;
    highestBuyOrder?: BuyOrder;
    lowestSellOrder?: SellOrder;
  };
  NewBuyOrder: {
    shoe: Shoe;
  };
  OrderSizeSelection: {shoe: Shoe};
  OrderBuyConfirmation: {shoe: Shoe; size: string; minPrice: number};
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
  CatalogSeeMore: {catalog: Catalog};
  SearchTabMain: undefined;
  TrasactionTabMain: undefined;
  AccountTabMain: undefined;
  AccountTabEditProfile: undefined;
  HomeTabNotification: undefined;
};

const Stack = createStackNavigator();

const RootStack = (): JSX.Element => (
  <NavigationContainer>
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
        name={RouteNames.Tab.AccountTab.EditProfile}
        component={AccountTabEditProfile}
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

export default RootStack;
