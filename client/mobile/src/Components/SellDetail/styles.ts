//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { StyleSheet } from "react-native";
import * as Assets from "../../Assets";

export default StyleSheet.create({
  shoeDetailContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    flex: 1,
    paddingHorizontal: 8,
    maxHeight: 100
  },

  shoeDetailTextContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingRight: 5
  },

  backButtonStyle: {
    height: 56,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },

  nextButtonStyle: {
    height: 56,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    borderTopWidth: 0.25,
    borderBottomWidth: 0.5,
    borderBottomColor: Assets.Styles.AppAccentColor,
    borderTopColor: Assets.Styles.AppAccentColor
  },

  activityIndicatorModalContainer: {
    alignItems: "center",
    justifyContent: "center"
  },

  acitivytIndicatorContainer: {
    width: 100,
    height: 100,
    backgroundColor: Assets.Styles.AppModalBackground,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Assets.Styles.ButtonBorderRadius
  }
});
