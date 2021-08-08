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
import {toCurrencyString, toMoneyString} from 'utilities';

const styles = StyleSheet.create({
  row: {
    flex: 4,
    justifyContent: 'space-between',
  },
  priceBoxContainer: {
    flex: 1,
    paddingTop: 16,
    paddingRight: 10,
  },
  emptypriceBox: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 0,
    height: 56,
    borderColor: themes.AppSecondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBox: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    height: 56,
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

  if (props.price){
    return (
      <View style={styles.priceBoxContainer}>
        <TouchableOpacity
          testID={'SizePriceItem'}
          style={[
            styles.priceBox,
            selected ? {backgroundColor: themes.AppSecondaryColor} : {},
          ]}
          onPress={(): void => props.onSelect(props.size)}>
          <View style={[styles.priceTextContainer]}>
            <AppText.SubCallout style={{color, opacity: selected ? 0.9 : 1}}>
              Cỡ: {props.size}
            </AppText.SubCallout>
            <AppText.SubCallout style={{marginBottom: 5, color: themes.AppPricePickColor, fontWeight: 'bold'}}>
              {props.price ? toMoneyString(props.price, 2) : '-'}
            </AppText.SubCallout>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  else {
    return <View style={styles.priceBoxContainer}>
      <View
          style={[
            styles.emptypriceBox,
          ]}>
          <View style={[styles.priceTextContainer]}>
            <AppText.SubCallout style={{color, opacity: selected ? 0.9 : 1}}>
            </AppText.SubCallout>
            <AppText.SubCallout style={{marginBottom: 5, color: themes.AppPricePickColor, fontWeight: 'bold'}}>
            </AppText.SubCallout>
          </View>
        </View>
  </View>;
  }
};

export const SizePricePicker = (props: {
  sizes: string[];
  priceMap: Map<string, number>;
  onSizeSelected: (size: string) => void;
}): JSX.Element => {
  const [selectedSize, setSelectedSize] = useState('');
  var tempSizes = Array.from(props.sizes);
  for (let item of tempSizes)
  {
    if (!props.priceMap.get(item))
    {
      tempSizes = tempSizes.filter(currItem => currItem !== item)
    }
  } 
  if (tempSizes.length % 3 === 2)
  {
    tempSizes.push('50');
  }
  else if (tempSizes.length % 3 === 1)
  {
    tempSizes.push('50');
    tempSizes.push('50');
  }


  return (
    <FlatList
      testID={'SizePriceList'}
      style={{
        flex: 1,
        marginTop: 0,
        paddingTop: 8,
        paddingLeft: 20,
        paddingRight: 10,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}
      data={tempSizes}
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
      numColumns={3}
      columnWrapperStyle={styles.row}
    />
  );
};
