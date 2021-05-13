import React from 'react';
import {
  NetworkRequestState,
  PopulatedSellOrder,
  getUserPopulatedOrders,
  IOrderService,
  FactoryKeys,
  OrderHistory,
  Profile,
  Account,
  TrackingStatus,
} from 'business';
import {
  connect,
  getDependency,
  getLastestStatus,
  getToken,
  statusToColor,
  statusToVietString,
  toCurrencyString,
  toVnDateFormat,
} from 'utilities';
import {IAppState} from 'store/AppStore';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {themes, strings} from 'resources';
import {AppText, ShoeHeaderSummary} from 'screens/Shared';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import {Icon, Chip} from 'react-native-elements';
import {images} from '../../resources/';
import {SectionList} from 'react-native';

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
  sellerActionButton: {
    height: themes.RegularButtonHeight,
    width: Dimensions.get('window').width * 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: themes.LargeBorderRadius,
    backgroundColor: '#F3F3F3',
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 13,
  },
  sellerAcceptButton: {
    backgroundColor: 'black',
  },
});

type Props = {
  sellOrderHistoryState: {
    state: NetworkRequestState;
    orders: PopulatedSellOrder[];
    error?: unknown;
  };
  account: Account;
  userProfile: Profile;
  // dispatch props
  getUserPopulatedOrders: () => void;

  // navigation
  navigation: StackNavigationProp<RootStackParams, 'SellOrderHistory'>;
};

type State = {
  refreshing: boolean;
  orders: OrderHistory[];
  modalVisible: boolean;
  selectedOrder: OrderHistory;
  shouldRenderSellerAction: boolean;
};

@connect(
  (state: IAppState) => ({
    sellOrderHistoryState: state.OrderState.sellOrderHistoryState,
    account: state.UserState.accountState.account,
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

  private orderService: IOrderService = getDependency(
    FactoryKeys.IOrderService,
  );

  public async componentDidMount(): Promise<void> {
    if (this.state.orders.length === 0) {
      this._getOrders();
    }
  }

  private _getOrders() {
    this.setState({refreshing: true}, () =>
      this.orderService
        .getOrderHistory(getToken())
        .then((orders) => this.setState({orders, refreshing: false})),
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      shouldRenderSellerAction: false,
      refreshing: false,
      orders: [],
      modalVisible: false,
      selectedOrder: undefined,
    };
  }

  public render(): JSX.Element {
    const {orders} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {this._renderOrders()}
        {orders.length === 0 && (
          <View style={styles.noOrderContainer}>
            <AppText.Body>Hiện chưa có đơn hàng nào</AppText.Body>
          </View>
        )}
        {this.state.selectedOrder && this._renderModal()}
      </SafeAreaView>
    );
  }

  private _renderOrders() {
    const {orders} = this.state;
    const {account} = this.props;
    if (orders.length === 0 || !account) {
      return <></>;
    }

    if (account.accessLevel === 'User') {
      return (
        <FlatList
          data={orders}
          keyExtractor={(item): string => item._id}
          renderItem={({item}): JSX.Element => this._renderOrder(item)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._getOrders()}
            />
          }
        />
      );
    }

    if (account.accessLevel === 'Seller') {
      const pendingOrders = [];
      const otherOrders = [];

      orders.forEach((o) => {
        if (getLastestStatus(o) === TrackingStatus.RECEIVED_BANK_TRANSFER) {
          pendingOrders.push(o);
        } else if (
          ![
            TrackingStatus.WAITING_FOR_BANK_TRANSFER,
            TrackingStatus.NOT_RECEIVED_BANK_TRANSFER,
            TrackingStatus.REFUND_TO_BUYER,
          ].find((s) => getLastestStatus(o) === s)
        ) {
          otherOrders.push(o);
        }
      });

      if (pendingOrders.length === 0 && otherOrders.length === 0) {
        return (
          <View style={styles.noOrderContainer}>
            <AppText.Body>Hiện chưa có đơn bán nào</AppText.Body>
          </View>
        );
      }
      const listData = [
        {title: 'Cần xác nhận', data: pendingOrders},
        {title: 'Các đơn còn lại', data: otherOrders},
      ];

      return (
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._getOrders()}
            />
          }
          sections={listData}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => this._renderOrder(item)}
          renderSectionHeader={({section: {title}}) => (
            <AppText.Title2 style={{margin: 15}}>{title}</AppText.Title2>
          )}
        />
      );
    }

    return <></>;
  }

  private _renderOrder(order: OrderHistory): JSX.Element {
    const shoe = order.shoe;
    const size = order.inventory.shoeSize;
    const latestStatus =
      order.trackingStatus[order.trackingStatus.length - 1].status;

    return (
      <TouchableOpacity
        key={order._id}
        onPress={this._onOrderPress.bind(this, order)}>
        <View style={styles.orderContainer}>
          <Image
            source={{uri: shoe.media.imageUrl}}
            style={{width: 100, aspectRatio: 1}}
            resizeMode={'contain'}
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: 20}}>
            <AppText.Headline style={{flexWrap: 'wrap', marginBottom: 10}}>
              {shoe.title}
            </AppText.Headline>
            <AppText.Subhead style={{marginBottom: 5}}>
              {strings.ShoeSize}: <AppText.Body>{size}</AppText.Body>
            </AppText.Subhead>
            <>
              <Chip
                buttonStyle={{
                  marginTop: 5,
                  borderRadius: 4,
                  backgroundColor: statusToColor.get(latestStatus),
                  paddingVertical: 5,
                  paddingHorizontal: 0,
                }}
                titleStyle={{
                  ...themes.TextStyle.callout,
                }}
                title={statusToVietString.get(latestStatus)}
              />
            </>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private _onOrderPress(order): void {
    this.setState({
      selectedOrder: order,
      modalVisible: true,
      shouldRenderSellerAction: true,
    });
  }

  private _renderModal(): JSX.Element {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        presentationStyle={'formSheet'}>
        {this._renderOrderDetail()}
      </Modal>
    );
  }

  private _renderOrderDetail() {
    const order = this.state.selectedOrder;
    const latestStatus =
      order.trackingStatus[order.trackingStatus.length - 1].status;

    return (
      <View style={styles.modalContentContainer}>
        <AppText.Title3 style={{alignSelf: 'center', marginTop: 20}}>
          Thông tin giao dịch
        </AppText.Title3>
        <Icon
          containerStyle={{position: 'absolute', top: 20, right: 20}}
          name="close"
          onPress={() => {
            this.setState({modalVisible: false});
          }}
        />
        {this._renderOrderActionForSeller()}
        <ShoeHeaderSummary shoe={order.shoe} />
        <ScrollView style={{flex: 1, padding: 20, alignSelf: 'stretch'}}>
          {this.modalInfo.map((info) => {
            return (
              <View style={styles.infoContainer}>
                <AppText.Body style={{color: 'rgba(0,0,0,0.6)'}}>
                  {info.header}
                </AppText.Body>
                <AppText.Body>
                  {info.value(this.state.selectedOrder)}
                </AppText.Body>
              </View>
            );
          })}
          <Chip
            buttonStyle={{
              borderRadius: 4,
              backgroundColor: statusToColor.get(latestStatus),
              paddingVertical: 5,
              paddingHorizontal: 0,
            }}
            titleStyle={{
              ...themes.TextStyle.callout,
            }}
            title={statusToVietString.get(latestStatus)}
          />
          {this._renderLine()}
          <AppText.SubHeadline style={{color: 'rgba(0,0,0,0.6)'}}>
            Thông tin giao hàng
          </AppText.SubHeadline>
          {this._renderShippingInfoDetails(order)}
          {this._renderLine()}
          <View style={{marginBottom: 100}}>
            <Image
              style={{width: 170, resizeMode: 'contain', height: 300}}
              source={images.ShippingStatusBuyer}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  private _renderOrderActionForSeller() {
    const order = this.state.selectedOrder;
    const account = this.props.account;

    if (!this.state.shouldRenderSellerAction) {
      return <></>;
    }

    if (!account || (account && account.accessLevel !== 'Seller')) {
      return <></>;
    }

    if (getLastestStatus(order) !== TrackingStatus.RECEIVED_BANK_TRANSFER) {
      return <></>;
    }

    return (
      <View style={{flexDirection: 'column', padding: 20}}>
        <AppText.Body style={{marginHorizontal: 10, textAlign: 'center'}}>
          Có người đặt mua sản phẩm của bạn. Bạn muốn bán sản phẩm không?
        </AppText.Body>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => this._sellerUpdate(true)}>
            <View style={styles.sellerActionButton}>
              <AppText.Body style={{textAlign: 'center'}}>
                {'Từ chối'.toUpperCase()}
              </AppText.Body>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._sellerUpdate(false)}>
            <View
              style={[styles.sellerActionButton, styles.sellerAcceptButton]}>
              <AppText.Body style={{textAlign: 'center', color: 'white'}}>
                {'Chấp nhận'.toUpperCase()}
              </AppText.Body>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private async _sellerUpdate(rejected: boolean) {
    const order = this.state.selectedOrder;
    await this.orderService.updateBySeller(
      getToken(),
      order._id,
      rejected
        ? TrackingStatus.SELLER_REJECTED_ORDER
        : TrackingStatus.SELLER_APPROVED_ORDER,
    );
    this.setState({shouldRenderSellerAction: false});
    this._getOrders();
  }

  private _renderLine(): JSX.Element {
    return (
      <View
        style={{
          borderBottomColor: '#BCBBC1',
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />
    );
  }

  private _renderShippingInfoDetails(order: OrderHistory): JSX.Element {
    const profile = this.props.userProfile;
    const email = profile?.userProvidedEmail;
    const phoneNumber = profile?.userProvidedPhoneNumber;
    const {addressLine1, addressLine2} = order.shippingAddress;

    const name = `${this.props.userProfile?.userProvidedName.lastName} ${this.props.userProfile?.userProvidedName.firstName}`;
    return (
      <>
        <AppText.Body style={{marginTop: 20}}>{name}</AppText.Body>
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
