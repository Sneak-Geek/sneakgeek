import React from 'react';
import {Shoe} from 'business';
import {View, TouchableOpacity, Image, ViewStyle} from 'react-native';
import {AppText} from './Text';
import { toCurrencyString } from 'utilities';

export const LiteShoeCard = (props: {
  shoe: Shoe;
  price: number;
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
        <View style={{alignItems:'flex-start',marginHorizontal: 12}}>
          <AppText.Subhead numberOfLines={2}>
            {props.shoe.title}
          </AppText.Subhead>
          <AppText.Subhead numberOfLines={2} style={{marginVertical: 8}}>
            {toCurrencyString(props.price)}
          </AppText.Subhead>
        </View>
      </View>
    </TouchableOpacity>
  );
};
