import React from 'react';
import {View} from 'react-native';
import {SizePricePicker} from 'screens/Shared';
import {getDependency, connect, getToken} from 'utilities';
import {
  ISettingsProvider,
  FactoryKeys,
  SettingsKey,
  Shoe,
  OrderType,
  SizePriceMap,
} from 'business';
import {strings} from 'resources';
import {toggleIndicator, showErrorNotification} from 'actions';
import {IOrderService} from 'business/src';

type Props = {
  shoe: Shoe;
  orderType: OrderType;
  onSelectSize: (sizePriceMap: SizePriceMap) => void;

  toggleLoading: (isLoading: boolean) => void;
  showErrorMessage: (msg: string) => void;
};

type State = {
  priceMap: SizePriceMap[];
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
      priceMap: [],
      selectedSize: '',
    };
  }

  public componentDidMount(): void {
    this._getPriceMap();
  }

  public render(): JSX.Element {
    if (this.state.priceMap.length === 0) {
      return <></>;
    }

    const priceMap = new Map<string, number>();
    this.state.priceMap.forEach((p) => {
      priceMap.set(p.shoeSize, p.sellPrice);
    });

    return (
      <View style={{flex: 1}}>
        <SizePricePicker
          sizes={this.shoeSizes}
          priceMap={priceMap}
          onSizeSelected={(size) => {
            const result = this.state.priceMap.find((t) => t.shoeSize === size);
            this.props.onSelectSize(result);
          }}
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
      const priceMap: SizePriceMap[] = await orderService.getPriceSizeMap(
        getToken(),
        this.shoe._id,
      );

      this.setState({priceMap});
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
