import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {AppText} from './Text';
import {strings, themes} from 'resources';
import {Shoe} from 'business';

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  shoeImage: {
    width: 120,
    aspectRatio: 2,
    alignSelf: 'center',
  },
});

export const ShoeHeaderSummary = (props: {shoe: Shoe}): JSX.Element => (
  <View style={styles.summaryContainer}>
    <Image
      source={{uri: props.shoe !== undefined ? props.shoe.media.imageUrl: undefined}}
      style={styles.shoeImage}
      resizeMode={'contain'}
    />
    <View style={styles.titleContainer}>
      <AppText.Body style={{flexWrap: 'wrap', marginBottom: 8}}>
        {props.shoe !== undefined ? props.shoe.title: ""}
      </AppText.Body>
      <AppText.Subhead>
        {strings.Gender}:{' '}
        {props.shoe !== undefined && props.shoe.gender === 'men' ? strings.Men : strings.Women}
      </AppText.Subhead>
    </View>
  </View>
);
