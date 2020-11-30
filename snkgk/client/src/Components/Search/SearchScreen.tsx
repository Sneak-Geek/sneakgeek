import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RouteNames from '../../Navigation/RouteNames';

const SearchScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Button
        title={'Go to shoe detail'}
        onPress={() => navigation.navigate(RouteNames.ShoeDetail)}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
