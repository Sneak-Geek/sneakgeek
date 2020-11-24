import * as React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Styles } from "../../Assets";
import { Text } from "../../Shared/UI";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface IAppDialog {
  dialogMessage: string;
  isDialogOpen: boolean;

  // dispatch props
  dismissDialog: () => void;
}

export class AppDialog extends React.Component<IAppDialog> {
  public render() {
    return (
      <Modal transparent={true} visible={this.props.isDialogOpen}>
        <View style={styles.rootContainer}>
          <View style={styles.dialogContainer}>
            <Text.Body style={{ margin: 20 }}>{this.props.dialogMessage}</Text.Body>
            <TouchableOpacity style={styles.confirmButton} onPress={() => this.props.dismissDialog()}>
              <Text.Title2 style={{ textAlign: "center", marginVertical: 10, color: "white" }}>OK</Text.Title2>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  confirmButton: {
    alignSelf: "stretch",
    width: "100%",
    borderColor: "transparent",
    borderTopColor: Styles.AppShadowColor,
    borderTopWidth: 1,
    backgroundColor: Styles.AppPrimaryColor,
    borderBottomLeftRadius: Styles.ButtonBorderRadius,
    borderBottomRightRadius: Styles.ButtonBorderRadius
  },

  dialogContainer: {
    width: "80%",
    backgroundColor: "white",
    alignItems: "stretch",
    justifyContent: "center",
    borderRadius: Styles.ButtonBorderRadius
  },

  rootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Styles.AppSecondaryColorBlurred
  }
});
