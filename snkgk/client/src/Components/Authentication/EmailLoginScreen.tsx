import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button} from 'react-native';
import RouteNames from '../../Navigation/RouteNames';

const EmailLogin = () => {
  const navigation = useNavigation();
  return (
    <>
      <Button
        title={'Go to sign up'}
        onPress={() => navigation.navigate(RouteNames.EmailSignUp)}
      />
      <Button
        title={'Go to main tab'}
        onPress={() => navigation.navigate(RouteNames.Tab)}
      />
    </>
  );
};

export default EmailLogin;
