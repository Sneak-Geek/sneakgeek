import React from 'react';
import {Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '../../../Navigation/RouteNames';

const SocialAuthScreen: React.FC<{}> = () => {
  const navigation = useNavigation();
  return (
    <>
      <Button
        title={'Go to email login'}
        onPress={() => navigation.navigate(RouteNames.EmailLogin)}
      />
      <Button
        title={'Go to main tab'}
        onPress={() => navigation.navigate(RouteNames.Tab)}
      />
    </>
  );
};

export default SocialAuthScreen;
