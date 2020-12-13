import React from 'react';
import {
  NetworkRequestState,
  SellOrder,
  PopulatedSellOrder,
  OrderStatus,
  getUserPopulatedOrders,
  Order,
  IOrderService,
  FactoryKeys
} from 'business';
import { connect, getDependency, getToken, toCurrencyString } from 'utilities';
import { IAppState } from 'store/AppStore';
import { FlatList } from 'react-native-gesture-handler';
import {
  View,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  RefreshControl,
  Modal,
  TouchableOpacity
} from 'react-native';
import { themes, strings } from 'resources';
import { AppText, ShimmerLoadList } from 'screens/Shared';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from 'navigations/RootStack';
import RouteNames from 'navigations/RouteNames';
import { Icon } from 'react-native-elements';

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

type State = {
  orders: Order[] | undefined;
  modalVisible: boolean;
  order: Order | undefined;
}

@connect(
  (state: IAppState) => ({
    sellOrderHistoryState: state.OrderState.sellOrderHistoryState,
  }),
  (dispatch: Function) => ({
    getUserPopulatedOrders: (): void =>
      dispatch(getUserPopulatedOrders('SellOrder')),
  }),
)
export class SellOrderHistory extends React.Component<Props, State> {
  private modalInfo = [{
    header: 'Cỡ giày',
    key: 'shoeSize'
  },
  {
    header: 'Giá bán',
    key: 'retailPrice'
  },
  {
    header: 'Ngày bán',
    key: 'updatedAt'
  },
  ];

  public async componentDidMount(): Promise<void> {
    const { state } = this.props.sellOrderHistoryState;
    if (state === NetworkRequestState.NOT_STARTED) {
      this.props.getUserPopulatedOrders();
    }

    const orderService: IOrderService = getDependency(
      FactoryKeys.IOrderService,
    );

    const data = await orderService
      .getOrderHistory(getToken());

    this.setState({ orders: data })
    console.log(this.state.orders);
  }

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      modalVisible: false,
      order: undefined
    }
  }

  public render(): JSX.Element {
    const { orders } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {orders?.length > 0 && (
          <FlatList
            data={orders}
            keyExtractor={(item): string => item._id}
            renderItem={({ item }): JSX.Element => this._renderOrder(item)}
          />
        )}
        {orders.length === 0 && (
          <View style={styles.noOrderContainer}>
            <AppText.Body>Hiện chưa có đơn bán nào</AppText.Body>
          </View>
        )}
        {this.state.order && this._renderModal()}
      </SafeAreaView>
    );
  }

  private _renderOrder(order: Order): JSX.Element {
    const shoe = order.shoe;
    let status: string;
    let color: string;

    return (
      <TouchableOpacity onPress={this._onOrderPress.bind(this, order)}>
        <View style={styles.orderContainer}>
          <Image
            source={{ uri: shoe.media.imageUrl }}
            style={{ width: 100, aspectRatio: 1 }}
            resizeMode={'contain'}
          />
          <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20 }}>
            <AppText.Subhead style={{ flexWrap: 'wrap', marginBottom: 10 }}>
              {shoe.title}
            </AppText.Subhead>
            <AppText.Subhead style={{ marginBottom: 5 }}>
              {strings.Price}:{' '}
              <AppText.Body>{toCurrencyString(shoe.retailPrice)}</AppText.Body>
            </AppText.Subhead>
            <AppText.Subhead style={{ marginBottom: 5 }}>
              {strings.ShoeSize}: <AppText.Body>{shoe.shoeSize}</AppText.Body>
            </AppText.Subhead>
          </View>
        </View>
      </TouchableOpacity>
    );
  }



  private _onOrderPress(order): void {
    this.setState({ order })
    this.setState({ modalVisible: true })
  }

  private _renderModal(): JSX.Element {
    const order = this.state.order;
    return (

      <Modal visible={this.state.modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 370, height: 550, backgroundColor: 'white', borderWidth: 1, borderColor: '#C8C8C8', borderRadius: 10, marginTop: 15, display: 'flex', flexDirection: 'column', paddingLeft: 20, paddingRight: 20 }}>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity>
                <Icon
                  name='g-translate'
                  color='#00aced' iconStyle={{ color: 'white' }} />
              </TouchableOpacity>
              <AppText.Title3 style={{ alignSelf: 'center', marginTop: 20 }}>Thông tin giao dịch</AppText.Title3>
              <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }}>
                <Icon containerStyle={{ marginTop: 20 }}
                  name='close'
                  color='#00aced' />
              </TouchableOpacity>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

              <Image style={{ width: 100, aspectRatio: 1 }}
                resizeMode={'contain'} source={{ uri: order.shoe.media.imageUrl }} />
              <View style={{ marginLeft: 20 }}>
                <AppText.SubHeadline>{order.shoe.title}</AppText.SubHeadline>
                <AppText.SubHeadline>SKU: {order._id}</AppText.SubHeadline>
              </View>
            </View>

            {this.modalInfo.map((info) => {
              return (
                <View style={{ margin: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText.Body>{info.header}</AppText.Body>
                  <AppText.Body> {info.key === 'updatedAt' ? order[info.key] : order.shoe[info.key]}</AppText.Body>
                </View>
              );
            })}

            <AppText.Title3 style={{ marginTop: 30 }}>
              Thông tin giao hàng
            </AppText.Title3>

            <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <AppText.Body>Chưa có thông tin giao hàng.</AppText.Body>
            </View>


          </View>
        </View>

      </Modal>

    );
  }
}
