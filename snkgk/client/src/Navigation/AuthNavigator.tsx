import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  EmailLoginScreen,
  EmailSignUpScreen,
  SocialAuthScreen,
} from '../Components/Authentication';
import RouteNames from './RouteNames';

const AuthStack = createStackNavigator();

const AuthNavigator: React.FC<{}> = () => (
  <AuthStack.Navigator initialRouteName={RouteNames.SocialAuth}>
    <AuthStack.Screen
      name={RouteNames.SocialAuth}
      component={SocialAuthScreen}
    />
    <AuthStack.Screen
      name={RouteNames.EmailLogin}
      component={EmailLoginScreen}
    />
    <AuthStack.Screen
      name={RouteNames.EmailSignUp}
      component={EmailSignUpScreen}
    />
  </AuthStack.Navigator>
);

export default AuthNavigator;
