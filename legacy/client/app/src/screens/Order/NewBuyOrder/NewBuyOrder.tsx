import React from 'react';
import {Shoe,BuyOrder,SellOrder,Profile,IOrderService,FactoryKeys,PaymentType} from 'business';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {View, ScrollView, FlatList, Dimensions} from 'react-native';
import { RootStackParams } from 'navigations/RootStack';
import {RouteProp} from '@react-navigation/native';
import {connect, getToken, getDependency} from 'utilities';
import { IAppState } from 'store/AppStore';
import {
  showErrorNotification,
  showSuccessNotification,
  toggleIndicator,
} from 'actions';
import {themes, strings} from 'resources';
import {AppText, ShoeHeaderSummary, BottomButton} from 'screens/Shared';
import {Icon} from 'react-native-elements';
import {
  HeaderHeightContext,
  StackNavigationProp,
} from '@react-navigation/stack';
import {styles} from './styles';
import {SizeSelection} from '../';
import { BuyConfirmation } from '../BuyConfirmation';
import { OrderSummary } from 'screens/Product/OrderSummary';
import RouteNames from 'navigations/RouteNames';
import ActionSheet from 'react-native-action-sheet';

type NewBuyOrderChild = {
  render: () => JSX.Element;
  canProceed: () => boolean;
}

type Props = {
    profile: Profile;
    route: RouteProp<RootStackParams, 'NewBuyOrder'>;
    navigation: StackNavigationProp<RootStackParams, 'NewBuyOrder'>;
    
    showErrorNotification: (message: string) => void;
    showSuccessNotification: (message: string) => void;
    toggleLoading: (isLoading: boolean) => void;
};

type State = {
    highestBuyOrder?: BuyOrder;
    lowestSellOrder?: SellOrder;
    newBuyOrder: Partial<BuyOrder>;
    currentIndex: number;
    // childComponents: NewBuyOrderChild[];
    isBuyNow: boolean;
    shippingFee?: number;
};

@connect(
    (state: IAppState) => ({
        profile: state.UserState.profileState.profile,
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
export class NewBuyOrder extends React.Component<Props, State> {
  private _shoe: Shoe;
  private _childFlatList: FlatList<NewBuyOrderChild>;
  private _childComponents: NewBuyOrderChild[];
  private _orderService: IOrderService;

  public constructor(props: Props) {
    super(props);
    
    this.state = {
      highestBuyOrder: null,
      lowestSellOrder: null,
      newBuyOrder: {
        shoeId: this.props.route.params.shoe._id,
        shoeSize: undefined,
        isNewShoe: true,
        buyPrice: undefined,
      },
      currentIndex: 0,
      isBuyNow: false,
      shippingFee: null,
    }

    this._shoe = this.props.route.params.shoe;
    this._orderService = getDependency<IOrderService>(FactoryKeys.IOrderService);

    this._childComponents = [
        {
          render: () => (
            <SizeSelection
              key={0}
              shoe={this._shoe}
              orderType="SellOrder"
              onSelectSize={this._setShoeSize.bind(this)}
            />
          ),
          canProceed: (): boolean => {
            return this.state.newBuyOrder.shoeSize !== undefined;
          },
        },
        {
          render: () => (
            <BuyConfirmation
              key={1}
              highestBuyOrder={this.state.highestBuyOrder}
              lowestSellOrder={this.state.lowestSellOrder}
              onSetBuyPrice={this._setBuyPrice.bind(this)}
            />
          ),
          canProceed: (): boolean => {
            return this.state.newBuyOrder.buyPrice > 0;
          },
        },
        {
          render: () => (
            <OrderSummary
              key={2}
              onEditShippingInfo={() =>
                this.props.navigation.navigate(RouteNames.Tab.AccountTab.Name, {
                  screen: RouteNames.Tab.AccountTab.EditProfile,
                })
              }
              userProfile={this.props.profile}
              orderType='BuyOrder'
              shoeSize={this.state.newBuyOrder.shoeSize}
              isNewShoe={this.state.newBuyOrder.isNewShoe}
              price={this.state.newBuyOrder.buyPrice}
              shippingFee={this.state.shippingFee}
            />
          ),
          canProceed: (): boolean => {
            return true;
          }
        }
      ];
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
              {this._renderNewBuyOrderContent()}
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
            <AppText.Title3>{strings.NewBuyOrder}</AppText.Title3>
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

  private async _onListScroll(forward = true) {
    const shouldContinue = this._childComponents[
      this.state.currentIndex
    ].canProceed();
    const canGoNext =
      shouldContinue &&
      forward &&
      this.state.currentIndex < this._childComponents.length - 1;
    const canGoBack = !forward && this.state.currentIndex >= 1;
    const nextIndex = forward
      ? this.state.currentIndex + 1
      : this.state.currentIndex - 1;

      if (canGoNext && this.state.currentIndex === 0) {
        this.props.toggleLoading(true);
        const {
          lowestSellOrder,
          highestBuyOrder
        } = await this._orderService.getLowestSellOrderAndHighestBuyOrder(
          getToken(),
          this.state.newBuyOrder.shoeId,
          this.state.newBuyOrder.shoeSize,
        );
        this.setState(
          {lowestSellOrder, highestBuyOrder, currentIndex: nextIndex},
          () => {
            this.props.toggleLoading(false);
            if (canGoNext || canGoBack) {
              this._childFlatList.scrollToIndex({
                index: nextIndex,
                animated: true,
              });
            }
          }
        );
      } else if (canGoNext && this.state.isBuyNow && this.state.currentIndex === this._childComponents.length - 2) {
        this.props.toggleLoading(true);
        let shippingFee = (await this._orderService.getTotalFee(getToken(), this.state.lowestSellOrder._id)).shippingFee;
        this.setState(
          {shippingFee, currentIndex: nextIndex},
          () => {
            this.props.toggleLoading(false);
            if (canGoNext || canGoBack) {
              this._childFlatList.scrollToIndex({
                index: nextIndex,
                animated: true,
              });
            }
          }
        )
      } else if (canGoNext || canGoBack) {
        this.setState({ currentIndex: nextIndex }, () => {
          this._childFlatList.scrollToIndex({
            index: nextIndex,
            animated: true
          })
        });
      }

    
  }

  private _renderNewBuyOrderContent(): JSX.Element {
    return (
      <FlatList
        ref={(ref) => (this._childFlatList = ref)}
        bounces={false}
        style={{flex: 1, marginTop: 10, height: '100%'}}
        horizontal={true}
        pagingEnabled={true}
        data={this._childComponents}
        renderItem={({item}) => item.render()}
        alwaysBounceHorizontal={false}
        scrollEnabled={false}
        keyExtractor={(_item, idx) => idx.toString()}
      />
    );
  }

  private _renderBottomButton(bottom: number) {
    const shouldBuyShoe =
      this.state.currentIndex === this._childComponents.length - 1;
    const shouldContinue = this._childComponents[
      this.state.currentIndex
    ].canProceed();

    return (
      <View>
        <BottomButton
          title={(shouldBuyShoe
            ? (this.state.isBuyNow ? strings.BuyShoe : strings.CreateBuyOrder)
            : strings.Continue
          ).toUpperCase()}
          style={{
            bottom,
            backgroundColor: shouldContinue
              ? themes.AppSecondaryColor
              : themes.AppDisabledColor,
            borderRadius: themes.LargeBorderRadius,
            marginLeft: 20,
            width: Dimensions.get('window').width - 40,
          }}
          onPress={() => this.state.currentIndex !== this._childComponents.length - 1 ? this._onListScroll() : (this.state.isBuyNow ? this._buyNow() : this._createBuyOrder())}
        />
      </View>
    );
  }

  private async _createBuyOrder() {
    this.props.toggleLoading(true);
    try {
      await this._orderService.createBuyOrder(getToken(), this.state.newBuyOrder);
      this.props.showSuccessNotification('Đã đặt mua thành công sản phẩm!');
      this.props.navigation.navigate(RouteNames.Product.ProductDetail);
    } catch (error) {
      this.props.showErrorNotification(
        'Đã có lỗi xảy ra, xin vui lòng thử lại',
      );
    } finally {
      this.props.toggleLoading(false);
    }
  }

  private _buyNow() {
    const options = [
      {
        name: strings.DomesticPayment,
        action: (): void => this._purchaseProduct('domestic'),
      },
      {
        name: strings.IntlPayment,
        action: (): void => this._purchaseProduct('intl'),
      },
      {name: strings.Cancel, action: (): void => null},
    ];

    ActionSheet.showActionSheetWithOptions(
      {
        options: options.map((t) => t.name),
        cancelButtonIndex: 2,
        destructiveButtonIndex: -1,
      },
      (btnIdx) => options[btnIdx].action(),
    );
  }

  private _purchaseProduct(paymentType: PaymentType): void {
    this.props.navigation.push(RouteNames.Order.Payment, {
      paymentType,
      sellOrder: this.state.lowestSellOrder,
    });
  }


  private _setShoeSize(shoeSize: string): void {
    this.setState(
      {newBuyOrder: {...this.state.newBuyOrder, shoeSize}},
    );
  }

  private _setBuyPrice(buyPrice: number, isBuyNow: boolean): void {
    this.setState({
      newBuyOrder: {...this.state.newBuyOrder, buyPrice},
      isBuyNow,
    })
  }
}
