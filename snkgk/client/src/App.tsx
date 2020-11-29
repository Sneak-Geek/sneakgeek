import React from 'react';
import RootNavigator from './Navigation/RootStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App: React.FC<{}> = () => (
  <>
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  </>
);

export default App;
