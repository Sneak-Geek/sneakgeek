// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";

import AppNavigator from "./Navigation/AppNavigator";
import { Provider } from "react-redux";
import { AppStore } from "./Store";
import { InAppNotifcationContainer } from "./Components/InAppNotification";
import { AppDialogContainer as AppDialog } from "./Components/AppDialog";

export default class App extends React.Component<{}> {
  public render() {
    return (
      <Provider store={AppStore}>
        <AppNavigator />
        <InAppNotifcationContainer />
        <AppDialog />
      </Provider>
    );
  }
}
