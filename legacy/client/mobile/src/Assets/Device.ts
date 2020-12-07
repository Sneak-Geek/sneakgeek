import { Dimensions, Platform } from "react-native";
import { getBottomSpace, getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";

export const Device = {
  IS_IOS: Platform.OS === "ios",
  IS_ANDROID: Platform.OS === "android",
  WIDTH: Dimensions.get("window").width,
  HEIGHT: Dimensions.get("window").height,
  isIphoneX: isIphoneX(),
  statusBarHeight: Platform.OS === "android" ? 0 : getStatusBarHeight(),
  bottomSpace: Platform.OS === "android" ? 0 : getBottomSpace()
};
