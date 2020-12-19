//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {AppText} from 'screens/Shared';
import {themes} from 'resources';
import {IAppState} from 'store/AppStore';
import {Notifcation} from 'reducers/NotificationReducers';
import {dismissNotification} from 'actions';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {reverse} from 'lodash';

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
    <TouchableWithoutFeedback
      style={[styles.toastContainer, styles.toastBackground]}
      onPress={onPress}>
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
          name={'x'}
          type={'feather'}
          size={themes.IconSize}
          containerStyle={styles.closeNotification}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export const InAppNotification: React.FC<{}> = () => {
  const timeouts: NodeJS.Timeout[] = [];
  const notifications = useSelector(
    (s: IAppState) => s.NotificationState.notifications,
  );
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   return () => timeouts.forEach((t) => clearTimeout(t));
  // });

  const onNotificationAdded = (item: Notifcation) => {
    const timeout = setTimeout(() => {
      dispatch(dismissNotification(item.id));
      clearTimeout(timeout);
    }, item.timeout * 1000);

    timeouts.push(timeout);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={{flex: 1}}>
        <FlatList
          style={styles.toastListContainer}
          keyExtractor={(_itm, idx) => idx.toString()}
          data={notifications}
          renderItem={({item}) => {
            onNotificationAdded(item);
            return (
              <NotificationItem
                item={item}
                onPress={() => dismissNotification(item.id)}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    zIndex: 1000,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  toastListContainer: {
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
    borderColor: 'black',
    borderRadius: themes.ButtonBorderRadius * 2,
    height: themes.RegularButtonHeight,
    borderWidth: 1,
    position: 'relative',
  },
  toastContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 2,
    paddingHorizontal: 8,
    paddingVertical: 10,
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
    top: 10,
    right: 10,
  },
});
