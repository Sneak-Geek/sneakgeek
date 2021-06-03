import {useNavigation} from '@react-navigation/native';
import {TrackingStatus} from 'business';
import {OrderHistory} from 'business/src';
import RouteNames from 'navigations/RouteNames';
import React from 'react';

import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {themes} from 'resources';
import {AppText} from 'screens/Shared';
import {getLastestStatus} from 'utilities';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type OrderNoticeProp = {
  order: OrderHistory;
  onCloseCallBack: any;
};

export const OrderNotice: React.FC<OrderNoticeProp> = (
  props: OrderNoticeProp,
) => {
  const {navigate} = useNavigation();
  const {order, onCloseCallBack} = props;
  switch (getLastestStatus(order)) {
    case TrackingStatus.WAITING_FOR_BANK_TRANSFER:
      return (
        <View
          style={{
            alignSelf: 'center',
          }}>
          <OrderNoticeContent
            message={
              'Bạn cần chuyển khoản cho SneakGeek để tiếp tục giao dịch này'
            }
            title={'Thông tin chuyển khoản'}
            onPress={() => {
              navigate(RouteNames.Order.Payment, {
                inventoryId: order.inventory?.id,
                sellPrice: order.inventory?.sellPrice,
                orderId: order._id,
              });
              onCloseCallBack();
            }}
          />
        </View>
      );
    default:
      return <View />;
  }
};

type OrderNoticeContentProp = {
  message?: string;
  onPress?: () => void;
  title?: string;
};

const OrderNoticeContent: React.FC<OrderNoticeContentProp> = (
  props: OrderNoticeContentProp,
) => {
  const {message, onPress, title} = props;

  return (
    <View style={styles.container}>
      <AppText.Body
        style={{
          width: 335,
          textAlign: 'center',
          marginBottom: 20,
          marginTop: 20,
        }}>
        {message}
      </AppText.Body>
      {title ? <Button onPress={onPress} title={title} /> : null}
      <View
        style={{
          marginTop: 20,
          borderColor: themes.DisabledColor,
          width: 1000,
          borderWidth: 1,
          borderStyle: 'dotted',
        }}
      />
    </View>
  );
};

const buttonStyles = StyleSheet.create({
  container: {
    display: 'flex',
    // backgroundColor: 'blue'
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 256,
    height: 52,
    backgroundColor: themes.ButtonColorDark,
    borderRadius: 50,
  },
  titleStyle: {
    color: 'white',
  },
});

type ButtonProp = {
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
};

const Button: React.FC<ButtonProp> = (props: ButtonProp) => {
  const {title, style, titleStyle, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress} style={[style, buttonStyles.container]}>
      <AppText.Headline style={[buttonStyles.titleStyle, titleStyle]}>
        {title.toUpperCase()}
      </AppText.Headline>
    </TouchableOpacity>
  );
};
