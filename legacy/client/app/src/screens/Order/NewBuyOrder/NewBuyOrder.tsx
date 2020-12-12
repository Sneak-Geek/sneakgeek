import React from 'react';
import {Shoe, Profile, IOrderService, FactoryKeys, PaymentType} from 'business';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {View, ScrollView, FlatList} from 'react-native';
import {RootStackParams} from 'navigations/RootStack';
import {RouteProp} from '@react-navigation/native';
import {connect, getDependency} from 'utilities';
import {IAppState} from 'store/AppStore';
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
import {OrderSummary} from 'screens/Product/OrderSummary';
import RouteNames from 'navigations/RouteNames';
import {SizePriceMap} from 'business/src';

type NewBuyOrderChild = {
  render: () => JSX.Element;
  canProceed: () => boolean;
};

type Props = {
  profile: Profile;
  route: RouteProp<RootStackParams, 'NewBuyOrder'>;
  navigation: StackNavigationProp<RootStackParams, 'NewBuyOrder'>;

  showErrorNotification: (message: string) => void;
  showSuccessNotification: (message: string) => void;
  toggleLoading: (isLoading: boolean) => void;
};

type State = {
  buyOrder: {
    inventoryId: string;
    shoeSize: string;
    sellPrice: number;
  };
  currentIndex: number;
  isBuyNow: boolean;
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
      buyOrder: {
        inventoryId: null,
        sellPrice: null,
        shoeSize: null,
      },
      currentIndex: 0,
      isBuyNow: false,
    };

    this._shoe = this.props.route.params.shoe;
    this._orderService = getDependency<IOrderService>(
      FactoryKeys.IOrderService,
    );

    this._childComponents = [
      {
        render: () => (
          <SizeSelection
            key={0}
            shoe={this._shoe}
            orderType="SellOrder"
            onSelectSize={(priceMap) => {
              this._setShoeSizeAndPrice(priceMap);
            }}
          />
        ),
        canProceed: (): boolean => {
          return this.state.buyOrder.shoeSize !== undefined;
        },
      },
      {
        render: () => (
          <OrderSummary
            key={1}
            onEditShippingInfo={() =>
              this.props.navigation.navigate(RouteNames.Tab.AccountTab.Name, {
                screen: RouteNames.Tab.AccountTab.EditProfile,
              })
            }
            userProfile={this.props.profile}
            shoeSize={this.state.buyOrder.shoeSize}
            price={this.state.buyOrder.sellPrice}
            inventoryId={this.state.buyOrder.inventoryId}
          />
        ),
        canProceed: (): boolean => {
          return true;
        },
      },
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

    if (
      canGoNext &&
      this.state.isBuyNow &&
      this.state.currentIndex === this._childComponents.length - 2
    ) {
    } else if (canGoNext || canGoBack) {
      this.setState({currentIndex: nextIndex}, () => {
        this._childFlatList.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
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
            ? this.state.isBuyNow
              ? strings.BuyShoe
              : strings.CreateBuyOrder
            : strings.Continue
          ).toUpperCase()}
          style={{
            bottom,
            backgroundColor: shouldContinue
              ? themes.AppSecondaryColor
              : themes.AppDisabledColor,
            borderRadius: themes.LargeBorderRadius,
          }}
          onPress={() =>
            this.state.currentIndex !== this._childComponents.length - 1
              ? this._onListScroll()
              : this._purchaseProduct('domestic')
          }
        />
      </View>
    );
  }

  private _purchaseProduct(paymentType: PaymentType): void {
    this.props.navigation.push(RouteNames.Order.Payment, {
      paymentType,
      inventoryId: this.state.buyOrder.inventoryId,
    });
  }

  private _setShoeSizeAndPrice(priceMap: SizePriceMap): void {
    this.setState({
      buyOrder: {
        ...this.state.buyOrder,
        sellPrice: priceMap.sellPrice,
        inventoryId: priceMap.inventoryId,
        shoeSize: priceMap.shoeSize,
      },
    });
  }
}
