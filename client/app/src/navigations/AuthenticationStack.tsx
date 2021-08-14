import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RouteNames from './RouteNames';
import {
  LoginScreen,
  EmailLoginScreen,
  EmailSignUpScreen,
  EmailVerifyScreen,
  ForgotPasswordScreen,
} from 'screens/Authentication';
import {strings, themes} from 'resources';
import { ForgotPasswordEmailSentScreen } from 'screens/Authentication/ForgotPasswordEmailSentScreen';

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
      name={RouteNames.Auth.EmailVerify}
      component={EmailVerifyScreen}
      options={{
        title: strings.SignUpEmail,
        ...themes.headerStyle,
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
    <Stack.Screen 
    name={RouteNames.Auth.ForgotPasswordEmailSent}
    component={ForgotPasswordEmailSentScreen}
    options={{
      title: strings.ForgotPassword,
      ...themes.headerStyle,
    }} 
    />
  </Stack.Navigator>
);
