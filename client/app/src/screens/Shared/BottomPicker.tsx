//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import React from 'react';
import {Modal, Picker, View, SafeAreaView, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {themes} from 'resources';

type State<T> = {
  selectedItem: T | null;
};

export interface Props<T> {
  options: T[];
  visible: boolean;
  currentValue?: T;

  optionLabelToString: (option: T) => string;
  onSelectPickerOK: (selectedValue: T) => void;
  onSelectPickerCancel: () => void;
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: themes.AppModalBackground,
    flex: 1,
    position: 'relative',
  },

  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },

  pickerActionButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export class BottomPicker<T> extends React.PureComponent<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);
    this.state = {
      selectedItem:
        this.props.currentValue ||
        (this.props.options?.length && this.props.options.length > 0 ? this.props.options[0] : null),
    };
  }

  public render(): JSX.Element {
    if (!this.props.visible) {
      return null;
    }

    return (
      <Modal
        presentationStyle={'overFullScreen'}
        visible={this.props.visible}
        transparent={true}
        animationType={'fade'}
        animated={true}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerActionButtons}>
              <Button
                title={'Cancel'}
                type={'clear'}
                onPress={() => this.props.onSelectPickerCancel()}
              />
              <Button
                title={'OK'}
                type={'clear'}
                onPress={() => {
                  if (this.state.selectedItem !== null) {
                    this.props.onSelectPickerOK(this.state.selectedItem);
                  }
                }}
              />
            </View>
            <Picker
              selectedValue={this.state.selectedItem}
              onValueChange={(item: T) => this.setState({selectedItem: item})}
              itemStyle={{backgroundColor: 'white'}}>
              {this.props.options?.map((option, idx) => (
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
