import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Strings from '../Common/Strings';
import {
  EmailLoginScreen,
  EmailSignUpScreen,
  SocialAuthScreen,
} from '../Components/Authentication';
import ThemeContext from '../Context/ThemeContext';
import RouteNames from './RouteNames';

const AuthStack = createStackNavigator();

const AuthNavigator: React.FC<{}> = () => (
  <ThemeContext.Consumer>
    {(theme) => (
      <AuthStack.Navigator initialRouteName={RouteNames.SocialAuth}>
        <AuthStack.Screen
          name={RouteNames.SocialAuth}
          component={SocialAuthScreen}
        />
        <AuthStack.Screen
          name={RouteNames.EmailLogin}
          component={EmailLoginScreen}
          options={{
            headerTitle: Strings.EmailLogin,
            headerBackTitleVisible: false,
            headerTitleStyle: theme.text.body,
          }}
        />
        <AuthStack.Screen
          name={RouteNames.EmailSignUp}
          component={EmailSignUpScreen}
        />
      </AuthStack.Navigator>
    )}
  </ThemeContext.Consumer>
);

export default AuthNavigator;
