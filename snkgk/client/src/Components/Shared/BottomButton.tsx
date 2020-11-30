import React from 'react';
import {StyleSheet, StyleProp, ViewStyle, TextStyle, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ThemeContext from '../../Context/ThemeContext';
import {AppText} from '../Shared/AppText';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
    paddingHorizontal: 20
  },
  buttonStyle: {
    justifyContent: 'center',
  },
  titleStyle: {
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
  <ThemeContext.Consumer>
    {(theme) => (
      <View
        style={[
          styles.containerStyle,
          theme.button,
          props.style,
        ]}>
        <TouchableOpacity
          style={[styles.buttonStyle, {height: theme.button.regularHeight}]}
          onPress={props.onPress}>
          <AppText.Headline
            style={[
              props.titleStyle,
              styles.titleStyle,
              {color: theme.color.textColorSecondary},
            ]}>
            {props.title}
          </AppText.Headline>
        </TouchableOpacity>
      </View>
    )}
  </ThemeContext.Consumer>
);
