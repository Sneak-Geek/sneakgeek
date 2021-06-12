/* eslint-disable react-native/no-inline-styles */
import {
  TrackingStatus,
  OrderHistory,
  FactoryKeys,
  IOrderService,
} from 'business';
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {themes, strings} from 'resources';
import {AppText, ShoeHeaderSummary} from 'screens/Shared';
import {IAppState} from 'store/AppStore';
import {
  getDependency,
  getLastestStatus,
  getToken,
  statusSentiment,
  statusToVietString,
  toCurrencyString,
  toVnDateFormat,
} from 'utilities';
import {OrderBankTransferNotice} from './OrderBankTransferNotice';

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
  line: {
    borderBottomColor: '#BCBBC1',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
});

type Props = {
  order: OrderHistory;
  onClose: () => void;
};

export const NewOrderDetail: React.FC<Props> = (props) => {
  const [shouldRenderAction, setShouldRenderAction] = React.useState<boolean>(
    true,
  );
  const account = useSelector(
    (state: IAppState) => state.UserState.accountState.account,
  );
  const profile = useSelector(
    (state: IAppState) => state.UserState.profileState.profile,
  );
  const latestStatus = getLastestStatus(props.order);
  const infoMap = [
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
  const orderService = getDependency<IOrderService>(FactoryKeys.IOrderService);

  const sellerUpdateOrder = async (isRejection: boolean) => {
    await orderService.updateBySeller(
      getToken(),
      props.order._id,
      isRejection
        ? TrackingStatus.SELLER_REJECTED_ORDER
        : TrackingStatus.SELLER_APPROVED_ORDER,
    );
    setShouldRenderAction(false);
  };

  const renderOrderActionForSeller = () => {
    if (!shouldRenderAction) {
      return <></>;
    }

    if (!account || (account && account.accessLevel !== 'Seller')) {
      return <></>;
    }

    if (latestStatus !== TrackingStatus.RECEIVED_BANK_TRANSFER) {
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
          <TouchableOpacity onPress={() => sellerUpdateOrder(true)}>
            <View style={styles.sellerActionButton}>
              <AppText.Body style={{textAlign: 'center'}}>
                {'Từ chối'.toUpperCase()}
              </AppText.Body>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sellerUpdateOrder(false)}>
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
  };

  const renderShippingInfo = () => {
    const email = profile?.userProvidedEmail;
    const phoneNumber = profile?.userProvidedPhoneNumber;
    const {addressLine1, addressLine2} = props.order.shippingAddress;

    const name = `${profile?.userProvidedName.lastName} ${profile?.userProvidedName.firstName}`;
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
  };

  const dashedLine = () => {
    const views = [];
    for (let i = 0; i < 5; i++) {
      views.push(
        <View
          key={i}
          style={{
            width: 2,
            height: 5,
            backgroundColor: themes.GreenSuccess,
            marginVertical: 2,
          }}
        />,
      );
    }

    return (
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        {views}
      </View>
    );
  };

  const circleIndicator = (status: TrackingStatus) => {
    if (status === TrackingStatus.BUYER_RECEIVED) {
    }
    const color = statusSentiment.get(status)
      ? themes.GreenSuccess
      : themes.AppErrorColor;
    return (
      <View
        style={{
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: color,
          width: 30,
          height: 30,
          borderRadius: 15,
        }}>
        <View
          style={{
            backgroundColor: color,
            width: 18,
            height: 18,
            borderRadius: 10,
          }}
        />
      </View>
    );
  };

  const renderTrackingProgress = () => {
    const trackingStatus = props.order.trackingStatus;
    return (
      <View style={{flexDirection: 'column', marginBottom: 100}}>
        {trackingStatus.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {circleIndicator(item.status)}
              {item.status !== TrackingStatus.BUYER_RECEIVED &&
                index !== trackingStatus.length - 1 &&
                dashedLine()}
            </View>
            <View style={{marginLeft: 10, marginTop: 5}}>
              <AppText.Body>{statusToVietString.get(item.status)}</AppText.Body>
              <AppText.Callout style={{marginVertical: 8}}>
                {toVnDateFormat(item.date)}
              </AppText.Callout>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderLine = () => <View style={styles.line} />;

  return (
    <View style={styles.modalContentContainer}>
      <AppText.Title3 style={{alignSelf: 'center', marginTop: 20}}>
        Thông tin giao dịch
      </AppText.Title3>
      <Icon
        containerStyle={{position: 'absolute', top: 20, right: 20}}
        name="close"
        onPress={props.onClose}
      />
      <OrderBankTransferNotice
        order={props.order}
        onCloseCallBack={props.onClose}
      />
      {renderOrderActionForSeller()}
      <ShoeHeaderSummary shoe={props.order.shoe} />
      <ScrollView
        style={{
          flex: 1,
          padding: 20,
          alignSelf: 'stretch',
        }}>
        {infoMap.map((info) => {
          return (
            <View style={styles.infoContainer}>
              <AppText.Body style={{color: 'rgba(0,0,0,0.6)'}}>
                {info.header}
              </AppText.Body>
              <AppText.Body>{info.value(props.order)}</AppText.Body>
            </View>
          );
        })}
        {renderLine()}
        <AppText.SubHeadline style={{color: 'rgba(0,0,0,0.6)'}}>
          Thông tin giao hàng
        </AppText.SubHeadline>
        {renderShippingInfo()}
        {renderLine()}
        {renderTrackingProgress()}
      </ScrollView>
    </View>
  );
};
