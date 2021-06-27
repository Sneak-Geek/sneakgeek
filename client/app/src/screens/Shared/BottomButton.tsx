import React, {useState} from 'react';
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
import {debounce} from '../../utilities';

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
  debounce?: boolean;
  disabled?: boolean;
} & TouchableOpacityProps;

export const BottomButton = (props: Props) => {
  const buttonHandler = props.debounce
    ? debounce(props.onPress)
    : props.onPress;

  return (
    <View style={[styles.containerStyle, props.style]}>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={buttonHandler}
        disabled={props.disabled}>
        <AppText.Headline style={[ styles.titleStyle, props.titleStyle]}>
          {props.title}
        </AppText.Headline>
      </TouchableOpacity>
    </View>
  );
};
