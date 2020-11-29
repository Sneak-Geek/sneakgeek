import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import RouteNames from '../../navigation/RouteNames';

const UserSettingsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Button
        title={'Go to login'}
        onPress={() => navigation.navigate(RouteNames.Auth)}
      />
    </SafeAreaView>
  );
};

export default UserSettingsScreen;
