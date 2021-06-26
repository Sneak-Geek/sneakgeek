import React from 'react';
import {InventorySearchResult, Shoe} from 'business';
import {View, Image, StyleSheet} from 'react-native';
import {AppText} from './Text';
import {themes, Constants} from 'resources';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {toCurrencyString} from 'utilities';

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
    backgroundColor: themes.AppSecondaryColor,
    minHeight: 52,
    alignItems: 'center',
    borderBottomEndRadius: themes.ButtonBorderRadius,
    borderBottomStartRadius: themes.ButtonBorderRadius,
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
  shoe: Shoe | InventorySearchResult;
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
        <AppText.Subhead
          numberOfLines={2}
          textBreakStrategy={'highQuality'}
          ellipsizeMode={'tail'}
          style={styles.title}>
          {props.shoe.title}
        </AppText.Subhead>
        {(props.shoe as InventorySearchResult).sellPrice && (
          <View style={styles.titleContainer}>
            <AppText.Body style={{color: 'white', marginLeft: 8}}>
              {toCurrencyString(
                (props.shoe as InventorySearchResult).sellPrice,
              )}
            </AppText.Body>
          </View>
        )}
      </View>
    </TouchableOpacity>
  </View>
);
