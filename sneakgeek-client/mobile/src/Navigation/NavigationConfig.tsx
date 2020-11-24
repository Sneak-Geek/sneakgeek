// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import {
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";
import Tab from "../Components/Tab";
import { LoginScreenContainer } from "../Components/Login/LoginScreen.Container";
import { SignUpScreenContainer } from "../Components/SignUp/SignUpScreen.Container";
import { SignInScreenContainer } from "../Components/SignIn/SignInScreen.Container";
import { ForgotPasswordScreenContainer } from "../Components/ForgotPassword/ForgotPasswordScreen.Container";
import { SellDetailScreenContainer } from "../Components/SellDetail/SellDetailScreen.Container";
import { RouteNames } from "./RouteNames";
import { Icon } from "react-native-elements";
import { SplashScreenContainer } from "../Components/Splash/SplashScreen";
import { ShoeDetailScreenContainer } from "../Components/ShoeDetail";
import { Text } from "../Shared/UI";
import { PaymentOptionsScreenContainer } from "../Components/PaymentOptions/PaymentOptionsScreen.Container";
import { AddCardScreenContainer } from "../Components/AddCard/AddCardScreen.Container";
import { SafeAreaMaterialTopTabBar } from "./SafeAreaMaterialTop";
import { Styles } from "../Assets";
import { TextStyle } from "../Shared/UI/Text";
import { ShoeRequireScreenContainer } from "../Components/ShoeRequire/ShoeRequireScreen.Container";
import { RequireSuccessScreenContainer } from "../Components/RequireSuccess/RequireSuccessScreen.Container";
import { ShoeSizeScreenContainer } from "../Components/ShoeSize/ShoeSizeScreen.Container";
import { ChangePasswordScreenContainer } from "../Components/ChangePassword/ChangePasswordScreen.Container";
import { ContactInfoScreenContainer } from "../Components/ContactInfo/ContactInfoScreen.Container";
import { SendRequireSuccessScreenContainer } from "../Components/SendReqrireSuccess/SendRequireSuccessScreen.Container";
import { TrackingSellScreenContainer } from "../Components/TrackingSell/TrackingSellScreen.Container";
import { OrderSellScreenContainer } from "../Components/OrderSell/OrderSellScreen.Container";
import { OrderAuctionScreenContainer } from "../Components/OrderAuction/OrderAuctionScreen.Container";
import { UserKindScreenContainer } from "../Components/UserKind/UserKindScreen.Container";
import { PaymentScreenContainer } from "../Components/Payment/PaymenScreen.Container";
import { NotiSettingScreenContainer } from "../Components/NotiSetting/NotiSettingScreen.Container";
import { ShareScreenContainer } from "../Components/Share/ShareScreen.Container";
import { BuySelectionScreenContainer } from "../Components/BuySelection/BuySelectionScreen.Container";
import { SeeMoreScreen } from "../Components/SeeMore";
import { WebViewHostedPayment } from "../Components/Payment/WebViewHostedPayment";

const AuthenticationStack = createStackNavigator(
  {
    [`${RouteNames.Login}`]: { screen: LoginScreenContainer },
    [`${RouteNames.EmailSignUp}`]: { screen: SignUpScreenContainer },
    [`${RouteNames.EmailSignIn}`]: { screen: SignInScreenContainer },
    [`${RouteNames.ForgotPassword}`]: { screen: ForgotPasswordScreenContainer }
  },
  {
    initialRouteName: RouteNames.Login
  }
);

const HomeTabNavigator = createStackNavigator(
  {
    [`${RouteNames.Tabs.HomeTab.MainScreen}`]: { screen: Tab.Home.Main }
  },
  {
    navigationOptions: {
      tabBarLabel: "Trang chủ",
      tabBarIcon: ({ tintColor }) => {
        tintColor = tintColor as string;
        return <Icon type={"ionicon"} name={"md-home"} size={28} color={tintColor} />;
      }
    }
  }
);

const UserInfoTabNavigator = createStackNavigator(
  {
    [`${RouteNames.Tabs.UserInfoTab.Info}`]: { screen: Tab.User.Main },
    [`${RouteNames.Tabs.UserInfoTab.Edit}`]: { screen: Tab.User.Edit },
    [`${RouteNames.Tabs.UserInfoTab.Search}`]: { screen: Tab.User.Search }
  },
  {
    navigationOptions: {
      tabBarLabel: "Cá nhân",
      tabBarIcon: ({ tintColor }) => {
        tintColor = tintColor as string;
        return <Icon type={"ionicon"} name={"md-person"} size={28} color={tintColor} />;
      }
    }
  }
);

const TransactionTabNavigator = createMaterialTopTabNavigator(
  {
    [`${RouteNames.Tabs.Transaction.BuyTab}`]: { screen: Tab.Transaction.Buy },
    [`${RouteNames.Tabs.Transaction.SellTab}`]: { screen: Tab.Transaction.Sell }
    // [`${RouteNames.Tabs.Transaction.HistoryTab}`]: { screen: Tab.Transaction.History }
  },
  {
    lazy: true,
    tabBarOptions: {
      showLabel: true,
      showIcon: false,
      style: {
        backgroundColor: "transparent"
      },
      labelStyle: {
        color: Styles.TextPrimaryColor,
        ...TextStyle.body
      },
      indicatorStyle: {
        backgroundColor: Styles.AppAccentColor
      }
    },
    tabBarComponent: SafeAreaMaterialTopTabBar,
    swipeEnabled: false,
    navigationOptions: {
      tabBarLabel: "Giao dịch",
      tabBarIcon: (options: any) => {
        const tintColor = options.tintColor as string;
        return <Icon type={"ionicon"} name={"md-cart"} size={28} color={tintColor} />;
      }
    }
  }
);

const PaymentStackNavigator = createStackNavigator(
  {
    [`${RouteNames.Payment}`]: { screen: PaymentScreenContainer },
    [`${RouteNames.WebViewPayment}`]: WebViewHostedPayment
  },
  {
    initialRouteName: RouteNames.Payment
  }
);

const AppTabRoot = createBottomTabNavigator(
  {
    [`${RouteNames.Tabs.HomeTab.TabName}`]: { screen: HomeTabNavigator },
    [`${RouteNames.Tabs.SearchTab}`]: { screen: Tab.Search.Main },
    [`${RouteNames.Tabs.Transaction.Root}`]: { screen: TransactionTabNavigator },
    [`${RouteNames.Tabs.UserInfoTab.TabName}`]: { screen: UserInfoTabNavigator }
  },
  {
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      activeTintColor: "black",
      inactiveTintColor: "lightgrey",
      labelStyle: Text.TextStyle.caption2
    },
    defaultNavigationOptions: {
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        navigation.setParams({ isForSell: false });
        defaultHandler();
      }
    }
  }
);

export const AppNavigator = createStackNavigator(
  {
    [`${RouteNames.Tabs.TabRoot}`]: {
      screen: AppTabRoot,
      navigationOptions: {
        header: null
      }
    },
    [`${RouteNames.Splash}`]: { screen: SplashScreenContainer },
    [`${RouteNames.Authentication}`]: {
      screen: AuthenticationStack,
      headerMode: "none",
      navigationOptions: { header: null }
    },
    [`${RouteNames.SellDetail}`]: { screen: SellDetailScreenContainer },
    [`${RouteNames.ShoeDetail}`]: { screen: ShoeDetailScreenContainer },
    [`${RouteNames.BuySelection}`]: { screen: BuySelectionScreenContainer },
    [`${RouteNames.PaymentOptions}`]: { screen: PaymentOptionsScreenContainer },
    [`${RouteNames.AddCard}`]: { screen: AddCardScreenContainer },
    [`${RouteNames.ShoeRequire}`]: { screen: ShoeRequireScreenContainer },
    [`${RouteNames.RequireSuccess}`]: { screen: RequireSuccessScreenContainer },
    [`${RouteNames.ShowSize}`]: { screen: ShoeSizeScreenContainer },
    [`${RouteNames.ChangePassword}`]: { screen: ChangePasswordScreenContainer },
    [`${RouteNames.ContactInfo}`]: { screen: ContactInfoScreenContainer },
    [`${RouteNames.SendRequireSuccess}`]: { screen: SendRequireSuccessScreenContainer },
    [`${RouteNames.TrackingSell}`]: { screen: TrackingSellScreenContainer },
    [`${RouteNames.OrderSell}`]: { screen: OrderSellScreenContainer },
    [`${RouteNames.OrderAuction}`]: { screen: OrderAuctionScreenContainer },
    [`${RouteNames.PaymentContainer}`]: {
      screen: PaymentStackNavigator,
      headerMode: "none",
      navigationOptions: { header: null }
    },
    [`${RouteNames.NotiSetting}`]: { screen: NotiSettingScreenContainer },
    [`${RouteNames.Share}`]: { screen: ShareScreenContainer },
    [`${RouteNames.UserKind}`]: { screen: UserKindScreenContainer },
    [`${RouteNames.SeeMore}`]: { screen: SeeMoreScreen }
  },
  {
    initialRouteName: RouteNames.Splash,
    mode: "card",
    navigationOptions: {
      gesturesEnabled: true
    }
  }
);

export default createAppContainer(AppNavigator);
