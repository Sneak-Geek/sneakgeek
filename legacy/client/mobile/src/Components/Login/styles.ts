//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { StyleSheet, ViewStyle } from "react-native";
import * as Assets from "../../Assets";
import { Text } from "../../Shared/UI";

export default StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "space-between"
  } as ViewStyle,

  socialContainer: {
    marginHorizontal: 42,
    paddingTop: 83,
    // height: "45%",
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "flex-end"
  } as ViewStyle,

  socialButton: {
    height: Assets.Styles.ButtonHeight,
    backgroundColor: Assets.Styles.ButtonPrimaryColor,
    borderRadius: Assets.Styles.ButtonBorderRadius,
    marginVertical: 5
  },

  socialButtonInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Assets.Styles.ButtonPadding
  },

  socialButtonText: {
    color: Assets.Styles.TextSecondaryColor,
    marginLeft: 20
  },

  label: {
    marginBottom: 20
  } as ViewStyle,

  socialLabel: {
    marginHorizontal: 42
  } as ViewStyle,

  buttonContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "flex-start"
  } as ViewStyle,

  buttonText: {
    fontSize: 20
  },

  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },

  emailBasedContainer: {
    height: "40%",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "space-between"
  } as ViewStyle,

  separator: {
    backgroundColor: "#BCBBC1",
    height: 1,
    alignSelf: "stretch",
    marginHorizontal: 42,
    marginVertical: 70
  } as ViewStyle,

  emailContainerStyle: {
    borderRadius: Assets.Styles.ButtonBorderRadius,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "flex-start",
    marginTop: 20,
    height: Assets.Styles.ButtonHeight,
    marginHorizontal: 42
  } as ViewStyle,

  emailInputStyle: {
    marginLeft: 20,
    ...Text.TextStyle.body
  } as ViewStyle,

  authButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: Assets.Styles.ButtonHeight
  }
});
