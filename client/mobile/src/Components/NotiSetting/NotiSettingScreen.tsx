//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  Switch
} from "react-native";
import { StackActions, NavigationScreenProps } from "react-navigation";
import { Icon } from "react-native-elements";
import * as Assets from "../../Assets";

interface INotiSettingScreenProps {
  onSetNewShoe: (newShoe: boolean) => void;
  onSetNews: (news: boolean) => void;
  onSetOrderSell: (orderSell: boolean) => void;
  onSetOrderVerify: (orderVerify: boolean) => void;
  onSetOrderSend: (orderSend: boolean) => void;
  onSetOrderReceive: (orderReceive: boolean) => void;
}

interface INotiSettingScreenState {
  [key: string]: any;
  newShoe: boolean;
  news: boolean;
  orderSell: boolean;
  orderVerify: boolean;
  orderSend: boolean;
  orderReceive: boolean;
}

interface Setting {
  stateName: string;
  title: string;
  onValueChange: (currentValue: boolean) => void;
  marginBottom?: boolean;
}

export class NotiSettingScreen extends React.Component<
  INotiSettingScreenProps,
  INotiSettingScreenState
> {
  static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    title: "Cài đặt thông báo",
    headerTitleStyle: {
      fontSize: 17,
      fontFamily: "RobotoCondensed-Bold"
    },
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    )
  });

  private settingsAndOptions: Setting[] = [
    {
      stateName: "newShoe",
      title: "Sản phẩm mới ra mắt",
      onValueChange: this.props.onSetNewShoe
    },
    {
      stateName: "news",
      title: "Tin tức",
      onValueChange: this.props.onSetNews,
      marginBottom: true
    },
    {
      stateName: "orderSell",
      title: "Đơn hàng đã bán",
      onValueChange: this.props.onSetOrderSell
    },
    {
      stateName: "orderVerify",
      title: "Đơn hàng đã xác thực",
      onValueChange: this.props.onSetOrderVerify,
      marginBottom: true
    },
    {
      stateName: "onSetOrderSend",
      title: "Đơn hàng đã gửi",
      onValueChange: this.props.onSetOrderSend
    },
    {
      stateName: "onSetOrderReceive",
      title: "Đơn hàng đã nhận",
      onValueChange: this.props.onSetOrderReceive
    }
  ];

  public constructor(props: any) {
    super(props);

    this.state = {
      newShoe: true,
      news: false,
      orderSell: true,
      orderVerify: true,
      orderSend: false,
      orderReceive: false
    };
  }

  public render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView
            style={{ paddingTop: 34 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {this.settingsAndOptions.map(setting => this._renderSettingAndOptions(setting))}
          </ScrollView>
          {this._renderButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderSettingAndOptions(setting: Setting): JSX.Element {
    return (
      <View
        key={setting.stateName}
        style={[styles.settingContainer, { marginBottom: setting.marginBottom ? 20 : 0 }]}
      >
        <Text style={styles.title}>{setting.title.toUpperCase()}</Text>
        <Switch
          trackColor={{ true: "#1ABC9C", false: "gainsboro" }}
          value={this.state[setting.stateName]}
          onValueChange={value =>
            this.setState(prevState => {
              // setting.onValueChange(value);
              return {
                ...prevState,
                [setting.stateName]: value
              };
            })
          }
        />
      </View>
    );
  }

  private _renderButton() {
    return (
      <TouchableOpacity style={styles.containerButton}>
        <Text style={styles.titleButton}>Xác nhận</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  contentContainer: {
    flex: 1
  },
  settingContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(196, 196, 196, 0.1)"
  },
  title: {
    fontSize: 14,
    fontFamily: "RobotoCondensed-Bold",
    color: "black",
    opacity: 0.6
  },
  containerButton: {
    height: Assets.Styles.ButtonHeight,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },
  titleButton: {
    fontSize: 17,
    fontFamily: "RobotoCondensed-Bold",
    color: "white"
  }
});
