//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from 'react';
import {View, StyleSheet, SafeAreaView, Modal} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {AppText} from 'screens/Shared';
import {themes} from 'resources';
import {IAppState} from 'store/AppStore';
import {Notifcation} from 'reducers/NotificationReducers';
import {dismissNotification} from 'actions';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

type NotificationItemProps = {
  item: Notifcation;
  onPress: () => void;
};

const NotificationItem = ({item, onPress}: NotificationItemProps) => {
  let icon: string;
  let reverseColor: string;

  switch (item.type) {
    case 'error':
      icon = 'x';
      reverseColor = themes.AppSellColor;
      break;
    case 'success':
      icon = 'check';
      reverseColor = themes.GreenSuccess;
      break;
    case 'regular':
      icon = '';
      reverseColor = '';
      break;
    default:
      break;
  }

  return (
    <View style={[styles.toastContainer, styles.toastBackground]}>
      <View style={styles.toastInnerContainer}>
        <Icon
          name={icon}
          color={reverseColor}
          reverse={true}
          size={themes.IconSize * 0.75}
          reverseColor={themes.AppAccentColor}
        />
        <AppText.Body style={styles.toastTitle}>{item.message}</AppText.Body>
        <Icon
          name={'close'}
          size={themes.IconSize * 1.2}
          containerStyle={styles.closeNotification}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export const InAppNotification: React.FC<{}> = () => {
  const timeouts: NodeJS.Timeout[] = [];
  const notifications = useSelector(
    (s: IAppState) => s.NotificationState.notifications,
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    return () => timeouts.forEach((t) => clearTimeout(t));
  });

  const onNotificationAdded = (item: Notifcation) => {
    const timeout = setTimeout(() => {
      dispatch(dismissNotification(item.id));
      clearTimeout(timeout);
    }, item.timeout * 1000);

    timeouts.push(timeout);
  };

  if (notifications.length === 0) {
    return <></>;
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      presentationStyle={'overFullScreen'}>
      <SafeAreaView style={styles.root}>
        <FlatList
          keyExtractor={(_itm, idx) => idx.toString()}
          data={notifications}
          renderItem={({item}) => {
            onNotificationAdded(item);
            return (
              <NotificationItem
                item={item}
                onPress={() => dispatch(dismissNotification(item.id))}
              />
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  toastInnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderColor: themes.DisabledColor,
    borderRadius: themes.ButtonBorderRadius * 2,
    height: themes.RegularButtonHeight,
    borderWidth: 0.5,
    position: 'relative',
  },
  toastContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 2,
    paddingHorizontal: 8,
    marginVertical: 5,
    zIndex: 1,
  },
  toastBackground: {
    backgroundColor: 'transparent',
  },
  toastTitle: {
    color: 'black',
    marginLeft: 10,
  },
  closeNotification: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});
