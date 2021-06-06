import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {AppText} from './Text';
import {themes} from 'resources';
import {toCurrencyString} from 'utilities';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceBoxContainer: {
    flex: 1,
    aspectRatio: 1,
    padding: 8,
  },
  priceBox: {
    flex: 1,
    // aspectRatio: 1,
    borderWidth: 1,
    borderColor: themes.AppSecondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const PriceBox = (props: {
  size: string;
  price?: number;
  selected: string;
  onSelect: (size: string) => void;
}): JSX.Element => {
  const selected = props.size === props.selected;
  const color = selected ? themes.AppAccentColor : themes.AppSecondaryColor;

  return (
    <View style={styles.priceBoxContainer}>
      <TouchableOpacity
        style={[
          styles.priceBox,
          selected ? {backgroundColor: themes.AppSecondaryColor} : {},
        ]}
        onPress={(): void => props.onSelect(props.size)}>
        <View style={[styles.priceTextContainer]}>
          <AppText.SubCallout style={{marginBottom: 5, color}}>
            {props.price ? toCurrencyString(props.price, 2) : '-'}
          </AppText.SubCallout>
          <AppText.SubCallout style={{color, opacity: selected ? 0.8 : 0.5}}>
            Cỡ: {props.size}
          </AppText.SubCallout>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const SizePricePicker = (props: {
  sizes: string[];
  priceMap: Map<string, number>;
  onSizeSelected: (size: string) => void;
}): JSX.Element => {
  const [selectedSize, setSelectedSize] = useState('');

  return (
    <FlatList
      style={{
        marginTop: 24,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}
      data={props.sizes}
      keyExtractor={(itm): string => itm}
      renderItem={({item}): JSX.Element => (
        <PriceBox
          size={item}
          price={props.priceMap.get(item)}
          selected={selectedSize}
          onSelect={(size: string): void => {
            props.onSizeSelected(size);
            setSelectedSize(size);
          }}
        />
      )}
      numColumns={4}
      columnWrapperStyle={styles.row}
    />
  );
};
