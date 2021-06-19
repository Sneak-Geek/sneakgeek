import {HeaderHeightContext} from '@react-navigation/stack';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {themes} from '../../resources';
import {AppText} from './Text';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  transparent: {
    color: 'transparent',
  },
});

type HeaderProp = {
  topInset: number;
  title: string;
  leftIcon: boolean;
};

export const Header: React.FC<HeaderProp> = (props: HeaderProp) => {
  const {topInset, title, leftIcon} = props;
  const navigation = useNavigation();
  const leftIconColor = leftIcon ? 'black' : 'transparent';
  const leftIconHandler = leftIcon ? () => navigation.goBack() : () => {};
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
            size={themes.IconSize}
            onPress={leftIconHandler}
            color={leftIconColor}
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
