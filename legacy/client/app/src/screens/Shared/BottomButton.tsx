import React from 'react';
import {StyleSheet, StyleProp, ViewStyle, TextStyle, View} from 'react-native';
import {themes} from 'resources';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppText} from './Text';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    height: themes.RegularButtonHeight,
  },
  buttonStyle: {
    height: themes.RegularButtonHeight,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  titleStyle: {
    color: themes.AppAccentColor,
    textAlign: 'center',
  },
});

type Props = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export const BottomButton = (props: Props) => (
  <View style={[styles.containerStyle, props.style]}>
    <TouchableOpacity style={styles.buttonStyle} onPress={props.onPress}>
      <AppText.Headline style={[props.titleStyle, styles.titleStyle]}>
        {props.title}
      </AppText.Headline>
    </TouchableOpacity>
  </View>
);
