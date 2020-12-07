//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { StackActions } from "react-navigation";
import { ShoesByBrandModalContainer } from "../ShoesByBrandModal/ShoesByBrandModal";
import { connect } from "react-redux";
import { IAppState } from "../../../Store";
import { ModalTypes } from "../ModalTypes";
import DebugDialog from "../DebugDialog";

interface Props {
  modalType: ModalTypes;
  dismissModal: () => void;
}

export class ModalRoot extends React.Component<Props> {
  public /** override */ render() {
    if (this.props.modalType === ModalTypes.None) {
      return null;
    }

    return (
      <TouchableWithoutFeedback onPress={this.props.dismissModal}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]}>
          {this._renderChildren()}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  private _renderChildren() {
    switch (this.props.modalType) {
      case ModalTypes.ShoesByBrand:
        return <ShoesByBrandModalContainer />;
      case ModalTypes.Debug:
        return <DebugDialog />;
      default:
        return null;
    }
  }
}

export const ModalRootContainer = connect(
  (state: IAppState) => ({
    modalType: state.ModalState.modalType
  }),
  (dispatch: Function) => ({
    dismissModal: () => {
      dispatch(StackActions.pop({}));
    }
  })
)(ModalRoot);
