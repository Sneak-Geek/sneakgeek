import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RouteNames from '../../Navigation/RouteNames';

const ShoeDetailScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Button
        title={'Go to Sell'}
        onPress={() => navigation.navigate(RouteNames.Sell)}
      />
      <Button
        title={'Go to Buy'}
        onPress={() => navigation.navigate(RouteNames.Buy)}
      />
      <Button
        title={'Go to auth'}
        onPress={() => navigation.navigate(RouteNames.Auth)}
      />
    </SafeAreaView>
  );
};

export default ShoeDetailScreen;
