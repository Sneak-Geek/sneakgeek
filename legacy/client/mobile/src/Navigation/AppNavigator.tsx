// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { createReactNavigationReduxMiddleware, createReduxContainer } from "react-navigation-redux-helpers";
import AppNavigator from "./NavigationConfig";
import { connect } from "react-redux";
import { IAppState } from "../Store";
import { NavigationState } from "react-navigation";

export const navigationMiddleware = createReactNavigationReduxMiddleware(state => (state as any).NavigationState);
export const UnconnectedMainAppNavigator = createReduxContainer(AppNavigator);

const mapDispatchToProps = (state: IAppState) => ({ navigation: state.NavigationState });

interface IMainAppNavigatorProps {
  dispatch: Function;
  navigation: NavigationState;
}

class MainAppNavigator extends React.Component<IMainAppNavigatorProps> {
  public render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar barStyle={"default"} />
        <UnconnectedMainAppNavigator dispatch={this.props.dispatch} state={this.props.navigation} />
      </View>
    );
  }
}

export default connect(mapDispatchToProps)(MainAppNavigator);
