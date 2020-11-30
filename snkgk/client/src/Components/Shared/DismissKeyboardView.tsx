import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Constructor,
  ViewComponent,
  NativeMethods,
} from 'react-native';

const DismissKeyboardHOC = (
  Comp: Constructor<NativeMethods> & typeof ViewComponent,
) => {
  return ({children, ...props}: React.PropsWithChildren<any>): JSX.Element => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};

export const DismissKeyboardView = DismissKeyboardHOC(View);
