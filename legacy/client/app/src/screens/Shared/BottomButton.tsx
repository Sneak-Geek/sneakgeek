import React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  TouchableOpacityProps,
} from 'react-native';
import {themes} from 'resources';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppText} from './Text';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
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
} & TouchableOpacityProps;

export const BottomButton = (props: Props) => (
  <View style={[styles.containerStyle, props.style]}>
    <TouchableOpacity
      style={styles.buttonStyle}
      onPress={props.onPress}
      disabled={props.disabled}>
      <AppText.Headline style={[props.titleStyle, styles.titleStyle]}>
        {props.title}
      </AppText.Headline>
    </TouchableOpacity>
  </View>
);
