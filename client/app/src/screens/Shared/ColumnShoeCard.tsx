import React from 'react';
import {Shoe} from 'business';
import {View, Image, StyleSheet} from 'react-native';
import {AppText} from './Text';
import {themes, Constants} from 'resources';
import {TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    position: 'relative',
    borderRadius: themes.ButtonBorderRadius,
    borderWidth: 1,
    borderColor: themes.DisabledColor,
  },
  cardImage: {
    flex: 1,
    width: '100%',
    aspectRatio: 1.5,
    marginTop: 15,
    alignSelf: 'center',
  },
  priceContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: themes.AppPrimaryColor,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: themes.ButtonBorderRadius,
  },
  titleContainer: {
    flexDirection: 'row',
    backgroundColor: themes.DisabledTheme,
    minHeight: 52,
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 8,
    marginVertical: 10,
  },
});

export const ColumnShoeCard = (props: {
  shoe: Shoe;
  onPress: () => void;
}): JSX.Element => (
  <View style={styles.rootContainer}>
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <Image
          source={{
            uri: props.shoe.media.imageUrl ?? Constants.imagePlaceholderUrl,
          }}
          style={styles.cardImage}
          resizeMode={'contain'}
        />
        <View style={styles.titleContainer}>
          <AppText.Subhead
            numberOfLines={2}
            textBreakStrategy={'highQuality'}
            ellipsizeMode={'tail'}
            style={styles.title}>
            {props.shoe.title}
          </AppText.Subhead>
        </View>
        {props.shoe.retailPrice && (
          <View style={styles.priceContainer}>
            <AppText.Footnote style={{color: 'white'}}>
              ${props.shoe.retailPrice}
            </AppText.Footnote>
          </View>
        )}
      </View>
    </TouchableOpacity>
  </View>
);
