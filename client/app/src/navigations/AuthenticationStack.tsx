import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RouteNames from './RouteNames';
import {
  LoginScreen,
  EmailLoginScreen,
  EmailSignUpScreen,
  ForgotPasswordScreen,
} from 'screens/Authentication';
import {strings, themes} from 'resources';

const Stack = createStackNavigator();

export const AuthenticationStack = (): JSX.Element => (
  <Stack.Navigator initialRouteName={RouteNames.Auth.Login}>
    <Stack.Screen
      name={RouteNames.Auth.Login}
      component={LoginScreen}
      options={{
        header: () => null,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name={RouteNames.Auth.EmailLogin}
      component={EmailLoginScreen}
      options={{
        title: strings.SignIn,
        ...themes.headerStyle,
      }}
    />
    <Stack.Screen
      name={RouteNames.Auth.EmailSignUp}
      component={EmailSignUpScreen}
      options={{
        title: strings.SignUp,
        ...themes.headerStyle,
      }}
    />
    <Stack.Screen
      name={RouteNames.Auth.ForgotPassword}
      component={ForgotPasswordScreen}
      options={{
        title: strings.ForgotPassword,
        ...themes.headerStyle,
      }}
    />
  </Stack.Navigator>
);
