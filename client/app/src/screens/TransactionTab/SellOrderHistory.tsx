import React from 'react';
import {
  NetworkRequestState,
  PopulatedSellOrder,
  getUserPopulatedOrders,
  IOrderService,
  FactoryKeys,
  OrderHistory,
  Profile,
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
import {AppText} from 'screens/Shared';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import {Chip} from 'react-native-elements';
import {SectionList} from 'react-native';
import {NewOrderDetail} from './NewOrderDetail';
import {images} from '../../resources';

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
  profile: Profile;
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
  minimizeWaitingForBankTransferOrders: boolean;
  minimizePendingOrders: boolean;
  minimizeOtherOrders: boolean;
};

@connect(
  (state: IAppState) => ({
    sellOrderHistoryState: state.OrderState.sellOrderHistoryState,
    profile: state.UserState.profileState.profile,
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
    this._getOrders();
  }

  private async _getOrders() {
    let token = await getToken();
    this.setState({refreshing: true}, () =>
      this.orderService.getOrderHistory(token).then((orders) => {
        this.setState({orders, refreshing: false});
      }),
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
      minimizeOtherOrders: false,
      minimizePendingOrders: false,
      minimizeWaitingForBankTransferOrders: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigation !== this.props.navigation) {
      this._getOrders();
    }
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
    const {profile} = this.props;
    if (orders.length === 0 || !profile) {
      return <></>;
    }

    if (!profile.isSeller) {
      let waitingForBankTransferOrders = [];
      let numberOfWaitingForBankTransferOrders = 0;
      let otherOrders = [];
      let numberOfOtherOrders = 0;

      orders.forEach((o) => {
        if (getLastestStatus(o) === TrackingStatus.WAITING_FOR_BANK_TRANSFER) {
          numberOfWaitingForBankTransferOrders++;
          waitingForBankTransferOrders.push(o);
        } else {
          numberOfOtherOrders++;
          otherOrders.push(o);
        }
      });

      if (
        numberOfOtherOrders === 0 &&
        numberOfWaitingForBankTransferOrders === 0
      )
        return (
          <View style={styles.noOrderContainer}>
            <AppText.Body>Hiện chưa có đơn mua nào</AppText.Body>
          </View>
        );

      if (this.state.minimizeWaitingForBankTransferOrders) {
        waitingForBankTransferOrders = [];
      }

      if (this.state.minimizeOtherOrders) {
        otherOrders = [];
      }

      const listData = [
        {
          title: `Chờ thanh toán (${numberOfWaitingForBankTransferOrders})`,
          data: waitingForBankTransferOrders,
          id: 1,
        },
        {
          title: `Các đơn còn lại (${numberOfOtherOrders})`,
          data: otherOrders,
          id: 2,
        },
      ];

      let ImgContent: React.FC<{id: number}> = (props: {id: number}) => {
        const {id} = props;

        if (
          (id === 1 && !this.state.minimizeWaitingForBankTransferOrders) ||
          (id === 2 && !this.state.minimizeOtherOrders)
        )
          return (
            <Image
              source={images.SectionListUpArrow}
              style={{width: 32, height: 32, margin: 15}}
            />
          );

        return (
          <Image
            source={images.SectionListDownArrow}
            style={{width: 32, height: 32, margin: 15}}
          />
        );
      };

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
          renderSectionHeader={({section: {title, id}}) => (
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText.Title2 style={{margin: 15}}>{title}</AppText.Title2>
              <TouchableOpacity
                onPress={() => {
                  if (id === 1) {
                    this.setState({
                      ...this.state,
                      minimizeWaitingForBankTransferOrders:
                        !this.state.minimizeWaitingForBankTransferOrders,
                    });
                  } else {
                    this.setState({
                      ...this.state,
                      minimizeOtherOrders: !this.state.minimizeOtherOrders,
                    });
                  }
                }}>
                <ImgContent id={id} />
              </TouchableOpacity>
            </View>
          )}
        />
      );
    }

    // TO DO (DUC): Duplicate codes
    if (profile.isSeller) {
      let pendingOrders = [];
      let numberOfPendingOrders = 0;
      let otherOrders = [];
      let numberOfOtherOrders = 0;

      orders.forEach((o) => {
        if (getLastestStatus(o) === TrackingStatus.RECEIVED_BANK_TRANSFER) {
          pendingOrders.push(o);
          numberOfPendingOrders++;
        } else if (
          ![
            TrackingStatus.NOT_RECEIVED_BANK_TRANSFER,
            TrackingStatus.REFUND_TO_BUYER,
          ].find((s) => getLastestStatus(o) === s)
        ) {
          otherOrders.push(o);
          numberOfOtherOrders++;
        }
      });

      if (pendingOrders.length === 0 && otherOrders.length === 0) {
        return (
          <View style={styles.noOrderContainer}>
            <AppText.Body>Hiện chưa có đơn bán nào</AppText.Body>
          </View>
        );
      }

      if (this.state.minimizePendingOrders) {
        pendingOrders = [];
      }

      if (this.state.minimizeOtherOrders) {
        otherOrders = [];
      }

      const listData = [
        {
          title: `Cần xác nhận (${numberOfPendingOrders})`,
          data: pendingOrders,
          id: 1,
        },
        {
          title: `Các đơn còn lại (${numberOfOtherOrders})`,
          data: otherOrders,
          id: 2,
        },
      ];

      let ImgContent: React.FC<{id: number}> = (props: {id: number}) => {
        const {id} = props;

        if (
          (id === 1 && !this.state.minimizePendingOrders) ||
          (id === 2 && !this.state.minimizeOtherOrders)
        )
          return (
            <Image
              source={images.SectionListUpArrow}
              style={{width: 32, height: 32, margin: 15}}
            />
          );

        return (
          <Image
            source={images.SectionListDownArrow}
            style={{width: 32, height: 32, margin: 15}}
          />
        );
      };

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
          renderSectionHeader={({section: {title, id}}) => (
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText.Title2 style={{margin: 15}}>{title}</AppText.Title2>
              <TouchableOpacity
                onPress={() => {
                  if (id === 1) {
                    this.setState({
                      ...this.state,
                      minimizePendingOrders: !this.state.minimizePendingOrders,
                    });
                  } else {
                    this.setState({
                      ...this.state,
                      minimizeOtherOrders: !this.state.minimizeOtherOrders,
                    });
                  }
                }}>
                <ImgContent id={id} />
              </TouchableOpacity>
            </View>
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
        <NewOrderDetail
          order={this.state.selectedOrder}
          onClose={() =>
            this.setState({modalVisible: false}, () => this._getOrders())
          }
        />
      </Modal>
    );
  }
}
