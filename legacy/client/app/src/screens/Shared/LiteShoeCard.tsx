import React from 'react';
import {Shoe} from 'business';
import {View, TouchableOpacity, Image, ViewStyle} from 'react-native';
import {AppText} from './Text';

export const LiteShoeCard = (props: {
  shoe: Shoe;
  onPress: () => void;
  style?: ViewStyle;
}): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{flex: 1, width: 125, ...props.style}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: props.shoe.media.imageUrl}}
          style={{width: 120, height: 120}}
          resizeMode={'contain'}
        />
        <AppText.Subhead numberOfLines={2} style={{marginHorizontal: 12}}>
          {props.shoe.title}
        </AppText.Subhead>
      </View>
    </TouchableOpacity>
  );
};
