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
  // TODO(hoangpham95): Move to functional component and use useSelector for redux
  private shoeSizes: string[] = [];
  private orderType: OrderType;
  private shoe: Shoe;

  public constructor(props: any) {
    super(props);

    this.shoe = this.props.shoe;
    this.shoeSizes = this._getShoeSizes();
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

  private _getShoeSizes() {
    const settings: ISettingsProvider = getDependency(
      FactoryKeys.ISettingsProvider,
    );
    const remoteSettings: {
      shoeSizes: {
        Adult: Array<string>;
        GradeSchool: Array<string>;
        PreSchool: Array<string>;
        Toddler: Array<string>;
      };
    } = settings.getValue(SettingsKey.RemoteSettings);
    switch (this.shoe.gender) {
      case 'men':
      case 'women':
        return remoteSettings.shoeSizes.Adult;
      case 'child':
        return remoteSettings.shoeSizes.GradeSchool;
      case 'preschool':
        return remoteSettings.shoeSizes.PreSchool;
      case 'toddler':
        return remoteSettings.shoeSizes.Toddler;
      default:
        return [];
    }
  }

  private async _getPriceMap(): Promise<void> {
    const orderService = getDependency<IOrderService>(
      FactoryKeys.IOrderService,
    );

    this.props.toggleLoading(true);
    var token;
    try{
      token = await getToken();
    }
    catch
    {
      token = undefined;
    }

    try {
      const priceMap: SizePriceMap[] = await orderService.getPriceSizeMap(
        token,
        this.shoe._id,
      );

      this.setState({priceMap});
    } catch (error) {
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
