import React from 'react';
import {SellOrder, PaymentType, IOrderService, FactoryKeys} from 'business';
import {getDependency, connect, getToken} from 'utilities';
import {toggleIndicator, showSuccessNotification} from 'actions';
import {strings, themes} from 'resources';
import {IAppState} from 'store/AppStore';
import {View, StyleSheet} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {
  HeaderHeightContext,
  StackNavigationProp,
} from '@react-navigation/stack';
import {AppText} from 'screens/Shared';
import {Icon} from 'react-native-elements';
import RouteNames from 'navigations/RouteNames';

type Props = {
  route: RouteProp<RootStackParams, 'OrderPayment'>;
  navigation: StackNavigationProp<RootStackParams, 'OrderPayment'>;
  toggleLoading: (isLoading: boolean) => void;
  showMessage: (message: string) => void;
};

type State = {
  paymentUrl: string;
};

type PaymentResult = 'success' | 'failed';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 0.5,
  },
});

@connect(
  (_: IAppState) => ({}),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean): void => {
      dispatch(toggleIndicator({isLoading, message: strings.PleaseWait}));
    },
    showMessage: (message: string): void => {
      dispatch(showSuccessNotification(message));
    },
  }),
)
export class Payment extends React.Component<Props, State> {
  private orderService: IOrderService;
  private paymentType: PaymentType;
  private inventoryId: string;

  public constructor(props: Props) {
    super(props);
    this.orderService = getDependency<IOrderService>(FactoryKeys.IOrderService);
    this.inventoryId = this.props.route.params.inventoryId;
    this.paymentType = this.props.route.params.paymentType;

    this.state = {
      paymentUrl: '',
    };
  }

  public componentDidMount(): void {
    this._getPaymentUrl();
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View
            style={{paddingTop: insets.top, backgroundColor: 'white', flex: 1}}>
            {this._renderHeader(insets.top)}
            {this.state.paymentUrl !== '' && (
              <WebView
                source={{uri: this.state.paymentUrl}}
                style={{flex: 1}}
                onMessage={this._onWebViewMessage.bind(this)}
              />
            )}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private async _getPaymentUrl(): Promise<void> {
    this.props.toggleLoading(true);
    try {
      const paymentUrl = await this.orderService.getCheckoutUrlForPurchase(
        getToken(),
        this.paymentType,
        this.inventoryId,
      );
      this.setState({paymentUrl});
    } catch (error) {
      console.warn(JSON.stringify(error, null, 2));
    } finally {
      this.props.toggleLoading(false);
    }
  }

  private _renderHeader(top: number): JSX.Element {
    const title =
      this.paymentType === 'intl'
        ? strings.IntlPayment
        : strings.DomesticPayment;

    return (
      <HeaderHeightContext.Consumer>
        {(headerHeight): JSX.Element => (
          <View
            style={[
              styles.header,
              {
                height:
                  headerHeight > 0
                    ? headerHeight + top
                    : themes.IosHeaderHeight,
              },
            ]}>
            <View style={{width: themes.IconSize, aspectRatio: 1}} />
            <AppText.Title3>{title}</AppText.Title3>
            <Icon
              name={'x'}
              type={'feather'}
              size={themes.IconSize}
              onPress={(): void => this.props.navigation.goBack()}
            />
          </View>
        )}
      </HeaderHeightContext.Consumer>
    );
  }

  private _onWebViewMessage(event: WebViewMessageEvent): void {
    const data = event.nativeEvent.data as PaymentResult;
    if (data === 'success') {
      this.props.showMessage(strings.PaymentSuccess);
      this.props.navigation.navigate(RouteNames.Tab.Name, {
        screen: RouteNames.Tab.TransactionTab.Name,
      });
    } else if (data === 'failed') {
      this.props.navigation.goBack();
      this.props.showMessage('Đã có lỗi xảy ra, xin vui lòng thử lại');
    }
  }
}
