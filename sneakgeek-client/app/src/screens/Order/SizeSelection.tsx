import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {SizePricePicker} from 'screens/Shared';
import {getDependency, connect, getToken} from 'utilities';
import {
  ISettingsProvider,
  FactoryKeys,
  SettingsKey,
  Shoe,
  OrderType,
} from 'business';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {ShoeHeaderSummary, BottomButton} from 'screens/Shared';
import {strings, themes} from 'resources';
import {toggleIndicator, showErrorNotification} from 'actions';
import RouteNames from 'navigations/RouteNames';
import {IOrderService} from 'business/src';

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
});

type Props = {
  // navigation: StackNavigationProp<RootStackParams>;
  // route: RouteProp<RootStackParams, 'SizeSelection'>;
  shoe: Shoe;
  orderType: OrderType;
  onSelectSize: (size: string) => void;

  toggleLoading: (isLoading: boolean) => void;
  showErrorMessage: (msg: string) => void;
};

type State = {
  priceMap: Map<string, number>;
  selectedSize: string;
};

@connect(
  (_) => ({}),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean) => {
      dispatch(toggleIndicator({isLoading, message: 'Xin chờ'}));
    },
    showErrorMessage: (message: string) => {
      dispatch(showErrorNotification(message));
    },
  }),
)
export class SizeSelection extends React.Component<Props, State> {
  private shoeSizes: string[] = [];
  private orderType: OrderType;
  private shoe: Shoe;

  public constructor(props: any) {
    super(props);

    const settings = getDependency<ISettingsProvider>(
      FactoryKeys.ISettingsProvider,
    );
    this.shoeSizes = settings.getValue(
      SettingsKey.RemoteSettings,
    ).shoeSizes.Adult;
    this.shoe = this.props.shoe;
    this.orderType = this.props.orderType;

    this.state = {
      priceMap: new Map(),
      selectedSize: '',
    };
  }

  public componentDidMount(): void {
    this._getPriceMap();
  }

  public render(): JSX.Element {
    return (
      <View style={{flex: 1}}>
        <SizePricePicker
          sizes={this.shoeSizes}
          priceMap={this.state.priceMap}
          onSizeSelected={this.props.onSelectSize}
        />
      </View>
    );
  }

  private async _getPriceMap(): Promise<void> {
    const orderService = getDependency<IOrderService>(
      FactoryKeys.IOrderService,
    );

    this.props.toggleLoading(true);

    try {
      const priceSizeMap: {
        price: number;
        size: string;
      }[] = await orderService.getPriceSizeMap(
        getToken(),
        this.orderType,
        this.shoe._id,
      );

      const result = new Map<string, number>();
      priceSizeMap.forEach(({price, size}) => result.set(size, price));

      this.setState({priceMap: result});
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.message.indexOf(403) >= 0
          ? strings.AccountNotVerifieid
          : strings.ErrorPleaseTryAgain;
      this.props.showErrorMessage(errorMessage);
    } finally {
      this.props.toggleLoading(false);
    }
  }
}
