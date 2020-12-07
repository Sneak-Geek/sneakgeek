import React from 'react';
import {connect} from 'utilities';
import {IAppState} from 'store/AppStore';
import {Notification, NetworkRequestState, getNotification} from 'business';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import {themes} from 'resources';
import RouteNames from 'navigations/RouteNames';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
  getNotificationState: NetworkRequestState;
  notifications: Notification[];
  getNotifications: () => void;
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: themes.NotificationBackground,
  },
  subTitle: {
    ...themes.TextStyle.subhead,
    marginTop: 8,
  },
});

const NotificationItem = (props: {item: Notification; onPress: () => void}) => (
  <ListItem
    title={props.item.title}
    subtitle={Intl.DateTimeFormat('vi').format(new Date(props.item.createdAt))}
    titleStyle={{...themes.TextStyle.body}}
    subtitleStyle={styles.subTitle}
    bottomDivider
    containerStyle={!props.item.isRead ? styles.notificationContainer : {}}
    leftAvatar={{source: {uri: props.item.imageUrl}}}
    onPress={props.onPress}
  />
);

@connect(
  (state: IAppState) => ({
    getNotificationState: state.AppNotificationState.state,
    notifications: state.AppNotificationState.notifications,
  }),
  (dispatch: Function) => ({
    getNotifications: () => {
      dispatch(getNotification());
    },
  }),
)
export class NotificationsScreen extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <FlatList
        data={this.props.notifications}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <NotificationItem
            item={item}
            onPress={() =>
              this.props.navigation.navigate(
                RouteNames.Tab.TransactionTab.Name,
                {
                  screen: RouteNames.Tab.TransactionTab.Detail,
                  params: {
                    orderId: item.orderId,
                    orderType: item.orderType,
                  },
                },
              )
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={
              this.props.getNotificationState === NetworkRequestState.REQUESTING
            }
            onRefresh={() => this.props.getNotifications()}
          />
        }
      />
    );
  }
}
