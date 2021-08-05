import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect} from 'utilities';
import {IAppState} from 'store/AppStore';
import {Account, getCurrentUser, NetworkRequestState} from 'business';
import RouteNames from 'navigations/RouteNames';
import RNSplashScreen from 'react-native-splash-screen';
import {View} from 'react-native';

type Props = {
  navigation: StackNavigationProp<any>;
  accountState: {
    state: NetworkRequestState;
    error?: any;
    account?: Account;
  };
  getCurrentUser: () => void;
};

@connect(
  (state: IAppState) => ({
    accountState: state.UserState.accountState,
  }),
  (dispatch: Function) => ({
    getCurrentUser: (): void => {
      dispatch(getCurrentUser());
    },
  }),
)
export class SplashScreen extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.getCurrentUser();
  }

  public componentDidUpdate(): void {
    if (
      this.props.navigation.isFocused() &&
      [NetworkRequestState.REQUESTING, NetworkRequestState.NOT_STARTED].some(
        (t) => t === this.props.accountState.state,
      )
    ) {
      const {navigation} = this.props;
      navigation.navigate(RouteNames.Tab.Name);
      RNSplashScreen.hide();
    }
  }

  public render(): JSX.Element {
    return <View testID={'splash'}/>;
  }
}
