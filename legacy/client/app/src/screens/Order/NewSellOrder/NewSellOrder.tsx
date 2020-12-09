import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {ShoeHeaderSummary, BottomButton, AppText} from 'screens/Shared';
import {Shoe, SellOrder, IOrderService, FactoryKeys, Profile} from 'business';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {connect, getToken, getDependency} from 'utilities';
import {
  showErrorNotification,
  showSuccessNotification,
  toggleIndicator,
} from 'actions';
import {styles} from './styles';
import {CdnService} from 'business/src';
import RouteNames from 'navigations/RouteNames';
import {IAppState} from 'store/AppStore';

type Props = {
  userProfile: Profile;
  route: RouteProp<RootStackParams, 'NewSellOrder'>;
  navigation: StackNavigationProp<RootStackParams, 'NewSellOrder'>;

  showErrorNotification: (message: string) => void;
  showSuccessNotification: (message: string) => void;
  toggleLoading: (isLoading: boolean) => void;
};

type SellDetailChild = {
  render: () => JSX.Element;
  canProceed: () => boolean;
};

type State = {
  sellOrder: Partial<SellOrder>;
};

@connect(
  (state: IAppState) => ({
    userProfile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean) => {
      dispatch(toggleIndicator({isLoading, message: strings.PleaseWait}));
    },
    showErrorNotification: (message: string): void => {
      dispatch(showErrorNotification(message));
    },
    showSuccessNotification: (message: string): void => {
      dispatch(showSuccessNotification(message));
    },
  }),
)
export class NewSellOrder extends React.Component<Props, State> {
  private _shoe: Shoe;

  public constructor(props: Props) {
    super(props);

    this._shoe = this.props.route.params.shoe;

    this.state = {
      sellOrder: {
        sellPrice: undefined,
        shoeId: this._shoe._id,
        shoeSize: undefined,
        isNewShoe: true,
        productCondition: {
          boxCondition: undefined,
          isTainted: false,
          isOutsoleWorn: false,
          otherDetail: '',
          isTorn: false,
        },
        pictures: [],
      },
    };
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, paddingTop: 0}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ShoeHeaderSummary shoe={this._shoe} />
          {this._renderInventory()}
          {this._renderBottomButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderInventory() {
    const inventoryItems = [
      {
        title: strings.ShoeSize,
        displayText: '',
        onUpdate: (text) => {
          /* set state here */
        },
      },
      {
        title: strings.InventoryAmount,
        displayText: '',
        onUpdate: (text) => {
          /* set state here */
        },
      },
      {
        title: strings.Price,
        displayText: '',
        onUpdate: (text) => {
          /* set state here */
        },
      },
    ];
    return (
      <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
        {inventoryItems.map((t) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <AppText.SubHeadline>{t.title}</AppText.SubHeadline>
            <TextInput
              placeholder={t.title}
              numberOfLines={1}
              style={{...themes.TextStyle.body, marginBottom: 20}}
              keyboardType={'number-pad'}
            />
          </View>
        ))}
      </View>
    );
  }

  private _renderBottomButton() {
    return (
      <BottomButton
        title={strings.SellShoe.toUpperCase()}
        onPress={() => this._sellShoe()}
        style={{
          backgroundColor: themes.AppSecondaryColor,
          borderRadius: themes.LargeBorderRadius,
        }}
      />
    );
  }

  private async _sellShoe() {
    const token = getToken();
    const order = this.state.sellOrder;

    const orderService = getDependency<IOrderService>(
      FactoryKeys.IOrderService,
    );
    const cdnService = getDependency<CdnService>(FactoryKeys.ICdnService);
    let uploadedPictures: string[] = [];
    this.props.toggleLoading(true);

    if (order.pictures.length > 0) {
      try {
        uploadedPictures = await cdnService.uploadImages(
          token,
          order?.pictures.map((i) => ({
            uri: i,
            type: 'image/png',
          })),
        );
        order.pictures = uploadedPictures;
      } catch (error) {
        this.props.showErrorNotification(strings.ErrorPleaseTryAgain);
        this.props.toggleLoading(false);
        return;
      }
    }

    try {
      await orderService.createSellOrder(token, order as SellOrder);
      this.props.showSuccessNotification('Đã bán thành công sản phẩm!');
      this.props.navigation.navigate(RouteNames.Product.ProductDetail);
    } catch (error) {
      this.props.showErrorNotification(
        'Đã có lỗi xảy ra, xin vui lòng thử lại',
      );
    } finally {
      this.props.toggleLoading(false);
    }
  }

  private _setShoeSize(shoeSize: string): void {
    this.setState({sellOrder: {...this.state.sellOrder, shoeSize}});
  }

  private _setShoePrice(sellPrice: number): void {
    this.setState((prevState) => ({
      ...prevState,
      sellOrder: {...prevState.sellOrder, sellPrice},
    }));
  }
}
