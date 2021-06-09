import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {BottomButton, ShoeHeaderSummary, AppText} from 'screens/Shared';
import {themes, strings} from 'resources';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {Shoe, Profile, SellOrder, BuyOrder} from 'business';
import {connect, getDependency, getToken, toCurrencyString} from 'utilities';
import {IAppState} from 'store/AppStore';
import {FactoryKeys, IOrderService, PaymentType} from 'business/src';
import {toggleIndicator, showSuccessNotification} from 'actions';
import {Divider, Tooltip, Icon} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {styles} from './styles';
import ActionSheet from 'react-native-action-sheet';

const OrderSectionWithTitle = (props: {
  title: string;
  value: string;
  tooltip?: string;
}): JSX.Element => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionTitleContainer}>
      <AppText.SubHeadline style={styles.sectionTitle}>
        {props.title.toUpperCase()}
      </AppText.SubHeadline>
      {/* {props.tooltip && (
        <Tooltip
          popover={<AppText.Subhead>{props.tooltip}</AppText.Subhead>}
          pointerColor={themes.AppDisabledColor}
          backgroundColor={themes.AppDisabledColor}
          height={null}>
          <Icon
            name={'info'}
            size={themes.IconSize}
            color={themes.AppDisabledColor}
            containerStyle={{marginBottom: 10, marginLeft: 10}}
          />
        </Tooltip>
      )} */}
      <AppText.Body>{props.value}</AppText.Body>
    </View>
  </View>
);

type Props = {
  highestBuyOrder: BuyOrder;
  lowestSellOrder: SellOrder;
  onSetBuyPrice: (buyPrice: number, isBuyNow: boolean) => void;
  // shoe: Shoe;
  // size: string;

  // highestBuyOrder?: BuyOrder;
  // lowestSellOrder?: SellOrder;
  // route: RouteProp<RootStackParams, 'OrderBuyConfirmation'>;
  // navigation: StackNavigationProp<RootStackParams, 'OrderBuyConfirmation'>;

  toggleLoading: (isLoading: boolean) => void;
  showNotification: (message: string) => void;
};

type State = {
  highestBuyOrder?: BuyOrder;
  lowestSellOrder?: SellOrder;
  // totalFee: {
  //   shippingFee: number;
  //   shoePrice: number;
  // };
  isBuyNow: boolean;
  displayBuyOrderPrice: string;
};

@connect(
  (_) => ({}),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean): void => {
      dispatch(toggleIndicator({isLoading, message: strings.PleaseWait}));
    },
    showNotification: (message: string): void => {
      dispatch(showSuccessNotification(message));
    },
  }),
)
export class BuyConfirmation extends React.Component<Props, State> {
  private shoe: Shoe;
  private size: string;
  private orderService: IOrderService;

  public constructor(props: Props) {
    super(props);

    // this.shoe = this.props.shoe;
    // this.size = this.props.size;

    this.state = {
      lowestSellOrder: this.props.lowestSellOrder,
      highestBuyOrder: this.props.highestBuyOrder,
      isBuyNow: false,
      displayBuyOrderPrice: '',
    };

    this.orderService = getDependency<IOrderService>(FactoryKeys.IOrderService);
  }

  // public componentDidMount(): void {
  //   this._getLowestSellOrderAndHighestBuyOrder();
  // }

  private _shouldRenderBuyNow(): boolean {
    return this.state.lowestSellOrder ? true : false;
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.highestBuyOrder && !prevProps.highestBuyOrder) {
      this.setState({
        highestBuyOrder: this.props.highestBuyOrder,
      });
    }

    if (this.props.lowestSellOrder && !prevProps.lowestSellOrder) {
      this.setState({
        lowestSellOrder: this.props.lowestSellOrder,
      });
    }
  }

  // private async _getLowestSellOrderAndHighestBuyOrder(): Promise<void> {
  //   this.props.toggleLoading(true);
  //   try {
  //     const {
  //       lowestSellOrder,
  //       highestBuyOrder,
  //     } = await this.orderService.getLowestSellOrderAndHighestBuyOrder(
  //       getToken(),
  //       this.shoe._id,
  //       this.size,
  //     );

  //     this.setState(
  //       {lowestSellOrder, highestBuyOrder},
  //       // this._getTotalFee.bind(this),
  //     );
  //   } catch (error) {
  //     console.warn(error);
  //   } finally {
  //     this.props.toggleLoading(false);
  //   }
  // }

  // private async _getTotalFee(): Promise<void> {
  //   if (!this.state.lowestSellOrder) {
  //     return;
  //   }

  //   this.props.toggleLoading(true);

  //   try {
  //     const {shippingFee, shoePrice} = await this.orderService.getTotalFee(
  //       getToken(),
  //       this.state.lowestSellOrder._id,
  //     );

  //     this.setState({
  //       totalFee: {shippingFee, shoePrice},
  //     });
  //   } catch (error) {
  //     console.warn(error);
  //   } finally {
  //     this.props.toggleLoading(false);
  //   }
  // }

  public render(): JSX.Element {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          width: Dimensions.get('window').width,
        }}>
        <View style={styles.orderTypeOutterContainer}>
          {this._renderOrderTypeSelector()}
        </View>
        <View style={{flex: 1, marginBottom: themes.RegularButtonHeight}}>
          <View style={{padding: 20}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              {this._renderOrderConfirmationDetail()}
            </View>
          </View>
        </View>
        {/* <BottomButton
            style={{backgroundColor: themes.AppSecondaryColor}}
            // onPress={this._onPurchaseButtonClicked.bind(this)}
            title={
              this.state.isBuyNow ? strings.BuyProduct : strings.SetBuyPrice
            }
          /> */}
      </View>
    );
  }

  private _renderOrderConfirmationDetail(): JSX.Element {
    if (!this.state.isBuyNow) {
      return (
        <View>
          <OrderSectionWithTitle
            title={strings.BuyNowPrice}
            value={
              this.state.lowestSellOrder
                ? toCurrencyString(this.state.lowestSellOrder.sellPrice)
                : '-'
            }
          />
          <OrderSectionWithTitle
            title={strings.HighestBuyOrderPrice}
            value={
              this.state.highestBuyOrder
                ? toCurrencyString(this.state.highestBuyOrder.buyPrice)
                : '-'
            }
            tooltip={strings.HighestBuyOrderExplanation}
          />
          {this._renderSetPriceBox()}
        </View>
      );
    }
    // const {userProvidedName, userProvidedAddress} = this.props.profile;
    // const address = [
    //   userProvidedAddress.streetAddress,
    //   userProvidedAddress.ward,
    //   userProvidedAddress.district,
    //   userProvidedAddress.city,
    // ];
    // const {shoePrice, shippingFee} = this.state.totalFee;

    return <View>{this._renderSetPriceBox()}</View>;
  }

  private _renderSetPriceBox(): JSX.Element {
    return (
      <View style={{flex: 1}}>
        <View style={styles.inputContainer}>
          <TextInput
            editable={!this.state.isBuyNow}
            keyboardType={'number-pad'}
            value={this.state.displayBuyOrderPrice}
            // placeholder={strings.SetBuyPrice}
            placeholder={toCurrencyString(1000000)}
            placeholderTextColor={themes.AppDisabledColor}
            style={[
              themes.TextStyle.body,
              {alignSelf: 'stretch', textAlign: 'center'},
            ]}
            onChangeText={(text): void => {
              const currentPrice = isNaN(parseInt(text)) ? 0 : parseInt(text);
              if (
                this.state.lowestSellOrder &&
                currentPrice >= this.state.lowestSellOrder.sellPrice
              ) {
                this.props.onSetBuyPrice(
                  this.state.lowestSellOrder.sellPrice,
                  true,
                );
                this.setState({
                  isBuyNow: true,
                  displayBuyOrderPrice: toCurrencyString(
                    this.state.lowestSellOrder.sellPrice,
                  ),
                });
              } else {
                this.setState({
                  displayBuyOrderPrice: text,
                  // newBuyOrder: {
                  //   ...this.state.newBuyOrder,
                  //   buyPrice: parseInt(text),
                  // },
                });
              }
            }}
            onEndEditing={(): void => {
              this.props.onSetBuyPrice(
                parseInt(this.state.displayBuyOrderPrice),
                this.state.isBuyNow,
              );
              this.setState({
                displayBuyOrderPrice: toCurrencyString(
                  this.state.displayBuyOrderPrice,
                ),
              });
            }}
            onFocus={(): void => {
              this.setState({displayBuyOrderPrice: ''});
            }}
          />
        </View>
        <AppText.SubHeadline style={{alignSelf: 'center', marginTop: 8}}>
          {strings.SetBuyPrice.toUpperCase()}
        </AppText.SubHeadline>
      </View>
    );
  }

  private _renderOrderTypeSelector(): JSX.Element {
    const {isBuyNow} = this.state;
    const isBuyNowDisabled = !this._shouldRenderBuyNow();

    return (
      <View style={styles.orderTypeContainer}>
        <TouchableOpacity
          style={[
            !isBuyNow ? styles.orderTypeSelected : {},
            styles.commonOrderType,
          ]}
          onPress={(): void => {
            this.props.onSetBuyPrice(0, false);
            this.setState({isBuyNow: false, displayBuyOrderPrice: ''});
          }}>
          <AppText.Callout
            style={[!isBuyNow ? {color: 'white'} : {}, {textAlign: 'center'}]}>
            {strings.SetBuyPrice.toUpperCase()}
          </AppText.Callout>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isBuyNowDisabled}
          style={[
            isBuyNow ? styles.orderTypeSelected : {},
            styles.commonOrderType,
          ]}
          onPress={(): void => {
            this.props.onSetBuyPrice(
              this.state.lowestSellOrder.sellPrice,
              true,
            );
            this.setState({
              isBuyNow: true,
              displayBuyOrderPrice: toCurrencyString(
                this.state.lowestSellOrder.sellPrice,
              ),
            });
          }}>
          <AppText.Callout
            style={[
              isBuyNow || isBuyNowDisabled ? {color: 'white'} : {},
              {textAlign: 'center'},
            ]}>
            {strings.BuyNow.toUpperCase()}
          </AppText.Callout>
        </TouchableOpacity>
      </View>
    );
  }

  // private async _onPurchaseButtonClicked(): Promise<void> {
  //   if (!this.state.isBuyNow) {
  //     this.props.toggleLoading(true);
  //     try {
  //       await this.orderService.createBuyOrder(
  //         getToken(),
  //         this.state.newBuyOrder,
  //       );
  //       this.props.showNotification(strings.SetPriceSuccess);
  //       this.props.navigation.navigate(RouteNames.Product.ProductDetail);
  //     } catch (error) {
  //       console.warn(error);
  //       console.log(error);
  //     } finally {
  //       this.props.toggleLoading(false);
  //     }

  //     return;
  //   }

  //   const options = [
  //     {
  //       name: strings.DomesticPayment,
  //       action: (): void => this._purchaseProduct('domestic'),
  //     },
  //     {
  //       name: strings.IntlPayment,
  //       action: (): void => this._purchaseProduct('intl'),
  //     },
  //     {name: strings.Cancel, action: (): void => null},
  //   ];

  //   ActionSheet.showActionSheetWithOptions(
  //     {
  //       options: options.map((t) => t.name),
  //       cancelButtonIndex: 2,
  //       destructiveButtonIndex: -1,
  //     },
  //     (btnIdx) => options[btnIdx].action(),
  //   );
  // }

  // private _purchaseProduct(paymentType: PaymentType): void {
  //   this.props.navigation.push(RouteNames.Order.Payment, {
  //     paymentType,
  //     sellOrder: this.state.lowestSellOrder,
  //   });
  // }
}
