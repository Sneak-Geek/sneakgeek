import React from 'react';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {View, ScrollView, FlatList, Dimensions} from 'react-native';
import {
  HeaderHeightContext,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';
import {themes, strings} from 'resources';
import {AppText, ShoeHeaderSummary, BottomButton} from 'screens/Shared';
import {Shoe, BuyOrder, SellOrder, IOrderService, FactoryKeys, Profile} from 'business';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {ProductSetPrice} from '../../Product/ProductSetPrice';
import {ProductConditionExtra} from '../../Product/ProductConditionExtra';
import {OrderSummary} from '../../Product/OrderSummary';
import {ProductRequiredInfo} from '../../Product/ProductRequiredInfo';
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
import {SizeSelection} from '../';

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
  highestBuyOrder?: BuyOrder;
  lowestSellOrder?: SellOrder;
  currentIndex: number;
  childComponents: SellDetailChild[];
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
  private _childFlatList: FlatList<SellDetailChild>;
  // private _usedShoeCondition: SellDetailChild = {
  //   render: (): JSX.Element => (
  //     <ProductConditionExtra
  //       key={1}
  //       onSetShoeHeavilyTorn={this._setShoeHeavilyTorn.bind(this)}
  //       onSetShoeOutsoleWorn={this._setShoeOutsoleWorn.bind(this)}
  //       onSetShoeTainted={this._setShoeTainted.bind(this)}
  //       onSetShoeInsoleWorn={this._setShoeInsoleWorn.bind(this)}
  //       onSetShoeOtherDetail={this._setShoeOtherDetail.bind(this)}
  //     />
  //   ),
  //   canProceed: (): boolean => {
  //     return true;
  //   },
  // };
  // private _maxChildComponentsSize = 4;

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
      highestBuyOrder: this.props.route.params.highestBuyOrder,
      lowestSellOrder: this.props.route.params.lowestSellOrder,
      currentIndex: 0,
      childComponents: [
        // {
        //   render: (): JSX.Element => (
        //     <ProductRequiredInfo
        //       key={0}
        //       order={this.state.sellOrder}
        //       onSetShoeSize={this._setShoeSize.bind(this)}
        //       onSetShoeCondition={this._setShoeCondition.bind(this)}
        //       onSetBoxCondition={this._setBoxCondition.bind(this)}
        //     />
        //   ),
        //   canProceed: (): boolean => {
        //     const {sellOrder} = this.state;
        //     return Boolean(
        //       sellOrder.shoeSize &&
        //         sellOrder.isNewShoe !== undefined &&
        //         sellOrder.productCondition.boxCondition,
        //     );
        //   },
        // },
        {
          render: (): JSX.Element => (
            <SizeSelection
              key={0}
              shoe={this._shoe}
              orderType="BuyOrder"
              onSelectSize={this._setShoeSize.bind(this)}
            />
          ),
          canProceed: (): boolean => {
            return this.state.sellOrder.shoeSize !== undefined;
          },
        },
        {
          render: (): JSX.Element => (
            <ProductSetPrice
              key={2}
              order={this.state.sellOrder}
              highestBuyPrice={this.state.highestBuyOrder?.buyPrice}
              lowestSellPrice={this.state.lowestSellOrder?.sellPrice}
              onSetShoePrice={this._setShoePrice.bind(this)}
            />
          ),
          canProceed: (): boolean => {
            const {sellOrder} = this.state;
            return sellOrder.sellPrice !== undefined;
          },
        },
        {
          render: (): JSX.Element => (
            <OrderSummary
              onEditShippingInfo={() =>
                this.props.navigation.navigate(RouteNames.Tab.AccountTab.Name, {
                  screen: RouteNames.Tab.AccountTab.EditProfile,
                })
              }
              userProfile={this.props.userProfile}
              orderType='SellOrder'
              shoeSize={this.state.sellOrder.shoeSize}
              isNewShoe={this.state.sellOrder.isNewShoe}
              price={this.state.sellOrder.sellPrice}
              key={3}
              onShoePictureAdded={(picUri: string): void =>
                this._onPictureAdded(picUri)
              }
            />
          ),
          canProceed: (): boolean => {
            return true;
          },
        },
      ],
    };
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View
            style={{paddingTop: insets.top, backgroundColor: 'white', flex: 1}}>
            {this._renderHeader(insets.top)}
            <ShoeHeaderSummary shoe={this._shoe} />
            <ScrollView style={{flex: 1}}>
              {this._renderSellerContent()}
            </ScrollView>
            {this._renderBottomButton(insets.bottom)}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderHeader(topInset: number): JSX.Element {
    return (
      <HeaderHeightContext.Consumer>
        {(headerHeight) => (
          <View
            style={{
              ...styles.headerContainer,
              height:
                headerHeight > 0
                  ? headerHeight + topInset
                  : themes.IosHeaderHeight,
            }}>
            {this.state.currentIndex > 0 ? (
              <Icon
                name={'ios-arrow-back'}
                type={'ionicon'}
                size={themes.IconSize}
                onPress={() => this._onListScroll(false)}
                hitSlop={{}}
              />
            ) : (
              <View style={{width: themes.IconSize, height: themes.IconSize}} />
            )}
            <AppText.Title3>{strings.NewSell}</AppText.Title3>
            <Icon
              name={'x'}
              type={'feather'}
              size={themes.IconSize}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        )}
      </HeaderHeightContext.Consumer>
    );
  }

  private _renderSellerContent(): JSX.Element {
    return (
      <FlatList
        ref={(ref) => (this._childFlatList = ref)}
        bounces={false}
        style={{flex: 1, marginTop: 10, height: '100%'}}
        horizontal={true}
        pagingEnabled={true}
        data={this.state.childComponents}
        renderItem={({item}) => item.render()}
        alwaysBounceHorizontal={false}
        scrollEnabled={false}
        keyExtractor={(_item, idx) => idx.toString()}
      />
    );
  }

  private _renderBottomButton(bottom: number) {
    const shouldSellShoe =
      this.state.currentIndex === this.state.childComponents.length - 1;
    const shouldContinue = this.state.childComponents[
      this.state.currentIndex
    ].canProceed();

    return (
      <View>
        <BottomButton
          title={(shouldSellShoe
            ? strings.SellShoe
            : strings.Continue
          ).toUpperCase()}
          onPress={() =>
            shouldSellShoe ? this._sellShoe() : this._onListScroll()
          }
          style={{
            bottom,
            backgroundColor: shouldContinue
              ? themes.AppSecondaryColor
              : themes.AppDisabledColor,
            borderRadius: themes.LargeBorderRadius,
            marginLeft: 20,
            width: Dimensions.get('window').width - 40,
          }}
        />
      </View>
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

  private _onListScroll(forward = true): void {
    const shouldContinue = this.state.childComponents[
      this.state.currentIndex
    ].canProceed();
    const canGoNext =
      shouldContinue &&
      forward &&
      this.state.currentIndex < this.state.childComponents.length - 1;
    const canGoBack = !forward && this.state.currentIndex >= 1;
    const nextIndex = forward
      ? this.state.currentIndex + 1
      : this.state.currentIndex - 1;

    if (canGoNext || canGoBack) {
      this.setState({currentIndex: nextIndex}, () => {
        this._childFlatList.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      });
    }
  }

  private _setShoeSize(shoeSize: string): void {
    this.setState({sellOrder: {...this.state.sellOrder, shoeSize}});
  }

  // private _setBoxCondition(boxCondition: string): void {
  //   this.setState({
  //     sellOrder: {
  //       ...this.state.sellOrder,
  //       productCondition: {
  //         ...this.state.sellOrder.productCondition,
  //         boxCondition,
  //       },
  //     },
  //   });
  // }

  // private _setShoeCondition(shoeCondition: string): void {
  //   const isNewShoe = shoeCondition === 'Mới';
  //   const childComponents = [...this.state.childComponents];
  //   if (
  //     isNewShoe &&
  //     this.state.childComponents.length === this._maxChildComponentsSize
  //   ) {
  //     childComponents.splice(1, 1);
  //   } else if (
  //     !isNewShoe &&
  //     this.state.childComponents.length + 1 === this._maxChildComponentsSize
  //   ) {
  //     childComponents.splice(1, 0, this._usedShoeCondition);
  //   }

  //   this.setState({
  //     sellOrder: {
  //       ...this.state.sellOrder,
  //       isNewShoe,
  //     },
  //     childComponents,
  //   });
  // }

  // private _setShoeHeavilyTorn(isTorn: boolean): void {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     sellOrder: {
  //       ...prevState.sellOrder,
  //       productCondition: {
  //         ...prevState.sellOrder.productCondition,
  //         isTorn,
  //       },
  //     },
  //   }));
  // }

  // private _setShoeOutsoleWorn(isOutsoleWorn: boolean): void {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     sellOrder: {
  //       ...prevState.sellOrder,
  //       productCondition: {
  //         ...prevState.sellOrder.productCondition,
  //         isOutsoleWorn,
  //       },
  //     },
  //   }));
  // }

  // private _setShoeInsoleWorn(isInsoleWorn: boolean): void {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     sellOrder: {
  //       ...prevState.sellOrder,
  //       productCondition: {
  //         ...prevState.sellOrder.productCondition,
  //         isInsoleWorn,
  //       },
  //     },
  //   }));
  // }

  // private _setShoeTainted(isTainted: boolean): void {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     sellOrder: {
  //       ...prevState.sellOrder,
  //       productCondition: {
  //         ...prevState.sellOrder.productCondition,
  //         isTainted,
  //       },
  //     },
  //   }));
  // }

  // private _setShoeOtherDetail(otherDetail: string): void {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     sellOrder: {
  //       ...prevState.sellOrder,
  //       productCondition: {
  //         ...prevState.sellOrder.productCondition,
  //         otherDetail,
  //       },
  //     },
  //   }));
  // }

  private _setShoePrice(sellPrice: number): void {
    this.setState((prevState) => ({
      ...prevState,
      sellOrder: {...prevState.sellOrder, sellPrice},
    }));
  }

  private _onPictureAdded(picUri: string): void {
    this.setState((prevState) => {
      return {
        ...prevState,
        sellOrder: {
          ...prevState.sellOrder,
          pictures: (this.state.sellOrder.pictures || []).concat(picUri),
        },
      };
    });
  }
}
