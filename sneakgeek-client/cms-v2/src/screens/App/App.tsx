import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppStore, history } from 'store';
import { ConnectedRouter } from 'connected-react-router';
import { LoginScreen } from '../LoginScreen';
import { ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import { HomeScreen } from '../HomeScreen';

export const App = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    <Provider store={AppStore}>
      <ConnectedRouter history={history}>
        <>
          <Switch>
            <Route path="/login" component={LoginScreen} />
            <Route path="/" render={() => <HomeScreen />} />
          </Switch>
        </>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
);
