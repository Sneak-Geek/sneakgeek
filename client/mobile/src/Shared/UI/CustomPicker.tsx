//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { Modal, Picker, View, SafeAreaView, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import * as Assets from "../../Assets";

export interface IPickerState<T> {
  selectedItem: T | null;
}

export interface IPickerProps<T> {
  options: T[];
  visible: boolean;

  optionLabelToString: (option: T) => string;
  onSelectPickerOK: (selectedValue: T) => void;
  onSelectPickerCancel: () => void;
}

export class CustomPicker<T> extends React.PureComponent<IPickerProps<T>, IPickerState<T>> {
  constructor(props: IPickerProps<T>) {
    super(props);
    this.state = {
      selectedItem: this.props.options.length > 0 ? this.props.options[0] : null
    };
  }

  public /** override */ render() {
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        visible={this.props.visible}
        transparent={true}
        animationType={"fade"}
        animated={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerActionButtons}>
              <Button
                title={"Cancel"}
                type={"clear"}
                onPress={() => this.props.onSelectPickerCancel()}
              />
              <Button
                title={"OK"}
                type={"clear"}
                onPress={() => {
                  if (this.state.selectedItem !== null) {
                    this.props.onSelectPickerOK(this.state.selectedItem);
                  }
                }}
              />
            </View>
            <Picker
              selectedValue={this.state.selectedItem}
              onValueChange={(item: T) => this.setState({ selectedItem: item })}
              itemStyle={{ backgroundColor: "white" }}
            >
              {this.props.options.map((option, idx) => (
                <Picker.Item
                  key={idx.toString()}
                  label={this.props.optionLabelToString(option)}
                  value={option}
                />
              ))}
            </Picker>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Assets.Styles.AppModalBackground,
    flex: 1,
    position: "relative"
  },

  pickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white"
  },

  pickerActionButtons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10
  }
});
