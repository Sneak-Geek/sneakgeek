import {HeaderHeightContext} from '@react-navigation/stack';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {themes} from '../../resources';
import {AppText} from './Text';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
});

type HeaderProp = {
  topInset: number;
  title: string;
};

export const Header: React.FC<HeaderProp> = (props: HeaderProp) => {
  const {topInset, title} = props;
  const navigation = useNavigation();
  return (
    <HeaderHeightContext.Consumer>
      {(headerHeight) => (
        <View
          style={{
            ...styles.headerContainer,
            height:
              headerHeight > 0
                ? headerHeight + topInset
                : themes.IosHeaderHeight,
          }}>
          <Icon
            name={'ios-arrow-back'}
            type={'ionicon'}
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
            hitSlop={{}}
          />
          <AppText.Title3>{title.toUpperCase()}</AppText.Title3>
          <Icon
            name={'x'}
            type={'feather'}
            size={themes.IconSize}
            onPress={() => {}}
            color={'transparent'}
          />
        </View>
      )}
    </HeaderHeightContext.Consumer>
  );
};
