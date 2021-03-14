import React from 'react';
import {
  NetworkRequestState,
  PopulatedSellOrder,
  getUserPopulatedOrders,
  Order,
  IOrderService,
  FactoryKeys,
  OrderHistory,
  Profile,
} from 'business';
import {
  connect,
  getDependency,
  getToken,
  toCurrencyString,
  toVnDateFormat,
} from 'utilities';
import { IAppState } from 'store/AppStore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { themes, strings } from 'resources';
import { AppText, ShoeHeaderSummary } from 'screens/Shared';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from 'navigations/RootStack';
import { Icon } from 'react-native-elements';
import {images} from '../../resources/';

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
  shippingInfoDetails: {
    marginVertical: 5,
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  infoContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

type Props = {
  sellOrderHistoryState: {
    state: NetworkRequestState;
    orders: PopulatedSellOrder[];
    error?: unknown;
  };

  userProfile: Profile;
  // dispatch props
  getUserPopulatedOrders: () => void;

  // navigation
  navigation: StackNavigationProp<RootStackParams, 'SellOrderHistory'>;
};

type State = {
  orders: OrderHistory[];
  modalVisible: boolean;
  selectedOrder: OrderHistory;
};

@connect(
  (state: IAppState) => ({
    sellOrderHistoryState: state.OrderState.sellOrderHistoryState,
    userProfile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    getUserPopulatedOrders: (): void =>
      dispatch(getUserPopulatedOrders('SellOrder')),
  }),
)
export class SellOrderHistory extends React.Component<Props, State> {
  private modalInfo = [
    {
      header: 'Cỡ giày',
      value: (order: OrderHistory) => order.inventory.shoeSize,
    },
    {
      header: 'Giá bán',
      value: (order: OrderHistory) =>
        toCurrencyString(order.inventory.sellPrice),
    },
    {
      header: 'Ngày mua',
      value: (order: OrderHistory) => toVnDateFormat(order.updatedAt),
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

    orderService
      .getOrderHistory(getToken())
      .then((orders) => this.setState({ orders }));
  }

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      modalVisible: false,
      selectedOrder: undefined,
    };
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
        {this.state.selectedOrder && this._renderModal()}
      </SafeAreaView>
    );
  }

  private _renderOrder(order: OrderHistory): JSX.Element {
    const shoe = order.shoe;
    const size = order.inventory.shoeSize;

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
              <AppText.Body>
                {toCurrencyString(order.inventory.sellPrice)}
              </AppText.Body>
            </AppText.Subhead>
            <AppText.Subhead style={{ marginBottom: 5 }}>
              {strings.ShoeSize}: <AppText.Body>{size}</AppText.Body>
            </AppText.Subhead>
            <AppText.Subhead style={{ marginBottom: 5 }}>
              {strings.BuyDate}: <AppText.Body>{toVnDateFormat(order.updatedAt)}</AppText.Body>
            </AppText.Subhead>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private _onOrderPress(order): void {
    this.setState({ selectedOrder: order, modalVisible: true });
  }

  private _renderModal(): JSX.Element {
    const order = this.state.selectedOrder;
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        presentationStyle={'formSheet'}>
        <View style={styles.modalContentContainer}>
          <AppText.Title3 style={{ alignSelf: 'center', marginTop: 20 }}>
            Thông tin giao dịch
          </AppText.Title3>
          <Icon
            containerStyle={{ position: 'absolute', top: 20, right: 20 }}
            name="close"
            onPress={() => {
              this.setState({ modalVisible: false });
            }}
          />
          <ShoeHeaderSummary shoe={order.shoe} />
          <ScrollView style={{ flex: 1, padding: 20, alignSelf: 'stretch' }}>
            {this.modalInfo.map((info) => {
              return (
                <View style={styles.infoContainer}>
                  <AppText.Body style={{color: 'rgba(0,0,0,0.6)'}}>{info.header}</AppText.Body>
                  <AppText.Body>
                    {info.value(this.state.selectedOrder)}
                  </AppText.Body>
                </View>
              );
            })}
          {this._renderLine()}
          <AppText.SubHeadline style={{color: 'rgba(0,0,0,0.6)'}}>
            Thông tin giao hàng
          </AppText.SubHeadline>
          {this._renderShippingInfoDetails(order)}
          {this._renderLine()}
          <View style={{ marginBottom: 100}}>
            <Image style={{ width: 170, resizeMode:'contain', height: 300}} source={images.ShippingStatus}/>
          </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  private _renderLine(): JSX.Element {
    return (
      <View
              style={{
                borderBottomColor: '#BCBBC1',
                borderBottomWidth: 1,
                marginVertical: 20
              }}
            />
    );
  }


  private _renderShippingInfoDetails(order: OrderHistory): JSX.Element {
    const profile = this.props.userProfile;
    const email = profile.userProvidedEmail;
    const phoneNumber = profile.userProvidedPhoneNumber;
    const { addressLine1, addressLine2 } = order.shippingAddress;

    const name = `${this.props.userProfile.userProvidedName.lastName} ${this.props.userProfile.userProvidedName.firstName}`;
    return (
      <>
        <AppText.Body style={{ marginTop: 20 }}>{name}</AppText.Body>
        <AppText.Subhead style={styles.shippingInfoDetails}>
          {phoneNumber}
        </AppText.Subhead>
        <AppText.Subhead style={styles.shippingInfoDetails}>
          {email}
        </AppText.Subhead>
        <AppText.Subhead style={styles.shippingInfoDetails}>
          {strings.Address}: {addressLine1}
        </AppText.Subhead>
        <AppText.Subhead style={styles.shippingInfoDetails}>
          {addressLine2}
        </AppText.Subhead>
      </>
    );
  }
}
