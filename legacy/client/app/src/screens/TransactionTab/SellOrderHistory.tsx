import React from 'react';
import {
  NetworkRequestState,
  SellOrder,
  PopulatedSellOrder,
  OrderStatus,
  getUserPopulatedOrders,
} from 'business';
import {connect, toCurrencyString} from 'utilities';
import {IAppState} from 'store/AppStore';
import {FlatList} from 'react-native-gesture-handler';
import {
  View,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {themes, strings} from 'resources';
import {AppText, ShimmerLoadList} from 'screens/Shared';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import RouteNames from 'navigations/RouteNames';

const styles = StyleSheet.create({
  orderContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: themes.DisabledColor,
  },
  noOrderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: themes.AppBackgroundColor,
  },
});

type Props = {
  sellOrderHistoryState: {
    state: NetworkRequestState;
    orders: PopulatedSellOrder[];
    error?: unknown;
  };

  // dispatch props
  getUserPopulatedOrders: () => void;

  // navigation
  navigation: StackNavigationProp<RootStackParams, 'SellOrderHistory'>;
};

@connect(
  (state: IAppState) => ({
    sellOrderHistoryState: state.OrderState.sellOrderHistoryState,
  }),
  (dispatch: Function) => ({
    getUserPopulatedOrders: (): void =>
      dispatch(getUserPopulatedOrders('SellOrder')),
  }),
)
export class SellOrderHistory extends React.Component<Props> {
  public componentDidMount(): void {
    const {state, orders} = this.props.sellOrderHistoryState;
    if (state === NetworkRequestState.NOT_STARTED && orders.length === 0) {
      this.props.getUserPopulatedOrders();
    }
  }

  public render(): JSX.Element {
    const {orders, state} = this.props.sellOrderHistoryState;

    if (
      this.props.sellOrderHistoryState.state === NetworkRequestState.REQUESTING
    ) {
      return <ShimmerLoadList />;
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {orders.length > 0 && (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={state === NetworkRequestState.REQUESTING}
                onRefresh={(): void => this.props.getUserPopulatedOrders()}
              />
            }
            data={orders}
            keyExtractor={(item): string => item._id}
            renderItem={({item}): JSX.Element => this._renderOrder(item)}
          />
        )}
        {orders.length === 0 && (
          <View style={styles.noOrderContainer}>
            <AppText.Body>Hiện chưa có đơn bán nào</AppText.Body>
          </View>
        )}
      </SafeAreaView>
    );
  }

  private _renderOrder(order: PopulatedSellOrder): JSX.Element {
    const shoe = order.shoe;
    let status: string;
    let color: string;

    switch (order.status) {
      case OrderStatus.PENDING:
        status = strings.Pending;
        color = themes.AppPendingColor;
        break;
      case OrderStatus.APPROVED:
        status = strings.Selling;
        color = themes.AppDisabledColor;
        break;
      case OrderStatus.DENIED:
        status = strings.Denied;
        color = themes.AppErrorColor;
        break;
      default:
        status = strings.Sold;
        color = themes.AppPrimaryColor;
        break;
    }

    return (
      <TouchableWithoutFeedback onPress={this._onOrderPress.bind(this, order)}>
        <View style={styles.orderContainer}>
          <Image
            source={{uri: shoe.media.imageUrl}}
            style={{width: 100, aspectRatio: 1}}
            resizeMode={'contain'}
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: 20}}>
            <AppText.Subhead style={{flexWrap: 'wrap', marginBottom: 10}}>
              {shoe.title}
            </AppText.Subhead>
            <AppText.Subhead style={{marginBottom: 5}}>
              {strings.Price}:{' '}
              <AppText.Body>{toCurrencyString(order.sellPrice)}</AppText.Body>
            </AppText.Subhead>
            <AppText.Subhead style={{marginBottom: 5}}>
              {strings.ShoeSize}: <AppText.Body>{order.shoeSize}</AppText.Body>
            </AppText.Subhead>
            <AppText.Subhead style={{marginBottom: 5}}>
              {strings.Condition}:{' '}
              <AppText.Body style={{color}}>{status}</AppText.Body>
            </AppText.Subhead>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  private _onOrderPress(order: SellOrder): void {
    this.props.navigation.navigate(RouteNames.Tab.TransactionTab.Detail, {
      order: order,
      orderType: 'SellOrder',
    });
  }
}
