import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {images} from 'resources';
import {AppText, BottomButton} from 'screens/Shared';
import {useNavigation} from '@react-navigation/native';
import RouteNames from 'navigations/RouteNames';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  imgContainer: {
    width: 96,
    height: 96,
    marginTop: 245,
    marginBottom: 65,
  },
  titleContainer: {
    marginBottom: 9,
  },
  contentContainer: {
    marginBottom: 3,
  },
  button: {
    height: 52,
    backgroundColor: '#1E2330',
    borderRadius: 40,
  },
  orderDetailButton: {
    marginBottom: 92,
  },
  continueShoppingButton: {
    marginBottom: 20,
  },
});

export const OrderConfirmation: React.FC = () => {
  const {navigate} = useNavigation();
  return (
    <View style={styles.root}>
      <Image source={images.GreenCheck} style={styles.imgContainer} />
      <AppText.Title2 style={styles.titleContainer}>
        Đã nhận đơn hàng
      </AppText.Title2>
      <AppText.Body style={styles.contentContainer}>
        SneakGeek đang xét duyệt đơn hàng.
      </AppText.Body>
      <AppText.Body style={styles.contentContainer}>
        Bạn sẽ nhận thông báo sau khi SneakGeek
      </AppText.Body>
      <AppText.Body>duyệt xong đơn thanh toán</AppText.Body>
      <BottomButton
        title={'Chi tiết đơn hàng'.toUpperCase()}
        onPress={() => {
          navigate(RouteNames.Tab.Name, {screen: 'TransactionTab'});
        }}
        style={[styles.button, styles.orderDetailButton]}
      />
      <BottomButton
        title={'Tiếp tục mua sắm'.toUpperCase()}
        onPress={() => {
          navigate(RouteNames.Tab.Name, {screen: 'HomeTab'});
        }}
        style={[styles.button, styles.continueShoppingButton]}
      />
    </View>
  );
};
