import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Constructor,
  NativeMethodsMixin,
  ViewComponent,
} from 'react-native';

const DismissKeyboardHOC = (
  Comp: Constructor<NativeMethodsMixin> & typeof ViewComponent,
) => {
  return ({children, ...props}): JSX.Element => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};

export const DismissKeyboardView = DismissKeyboardHOC(View);
