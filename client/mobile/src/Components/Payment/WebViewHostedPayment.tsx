import * as React from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { NavigationActions, NavigationRoute, NavigationScreenProp, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { RouteNames } from "../../Navigation";
import { showNotification } from "../../Actions";

interface IProps {
  navigation: NavigationScreenProp<NavigationRoute>;
  back: () => void;
  showNotification: (message: string) => void;
}

export const UnconnectedWebViewHostedPayment = (props: IProps) => {
  const onWebViewMessage = (event: WebViewMessageEvent) => {
    const obj = event.nativeEvent.data;
    try {
      const parsedObj = JSON.parse(obj);
      if (parsedObj && (parsedObj as any).success) {
        props.showNotification("Đã mua thành công!");
        props.back();
      }
    } catch (error) {}
  };

  const url = props.navigation.getParam("url");
  return <WebView source={{ uri: url }} onMessage={onWebViewMessage} />;
};

const mapDispatchToProps = (dispatch: Function) => ({
  showNotification: (message: string) => {
    dispatch(showNotification(message));
  },

  back: () => {
    dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: RouteNames.AppNavigator
          })
        ]
      })
    );
  }
});

export const WebViewHostedPayment = connect(null, mapDispatchToProps)(UnconnectedWebViewHostedPayment);
