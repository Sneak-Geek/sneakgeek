import React from 'react';
import RootNavigator from './Navigation/RootStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from './Redux/Store';

const App: React.FC<{}> = () => (
  <>
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  </>
);

export default App;
