//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { getInset } from "react-native-safe-area-view";
import { CustomPicker, Text, ShoeSizePicker } from "../../../Shared/UI";
import * as Assets from "../../../Assets";
import { IAppSettingsService } from "../../../Service/AppSettingsService";
import { container, Types } from "../../../Config/Inversify";

enum PickerType {
  ShoeCondition = "ShoeCondition",
  BoxCondition = "BoxCondition"
}

type Props = {
  onSetShoeSize: (shoeSize: string) => void;
  onSetShoeCondition: (shoeCondition: string) => void;
  onSetBoxCondition: (boxCondition: string) => void;
};

type State = {
  shoeSize?: string;
  shoeCondition: string;
  boxCondition: string;
  isSelectingShoeSize: boolean;
  isShowingPicker: boolean;
  pickerVisible: boolean;
  currentPicker?: PickerType;

  // indexing purpose
  [key: string]: any;
};

type Setting = {
  readonly stateName: string;
  readonly title: string;
  readonly options: string[];
  readonly onLaunchOptionChooser: () => void;
};

export class ShoeConditionRequiredInfoComponent extends React.PureComponent<Props, State> {
  private appSettings: IAppSettingsService = container.get<IAppSettingsService>(
    Types.IAppSettingsService
  );
  private remoteSettings = this.appSettings.getSettings().RemoteSettings;

  private settingsAndOptions: Setting[] = [
    {
      stateName: "shoeSize",
      title: "Cỡ giày",
      options: this.remoteSettings ? this.remoteSettings.shoeSizes.Adult : [],
      onLaunchOptionChooser: () => {
        this.setState({ isSelectingShoeSize: true });
      }
    },
    {
      stateName: "shoeCondition",
      title: "Tình trạng",
      options: this.remoteSettings ? this.remoteSettings.shoeConditions : [],
      onLaunchOptionChooser: () => {
        this.setState({ pickerVisible: true, currentPicker: PickerType.ShoeCondition });
      }
    },
    {
      stateName: "boxCondition",
      title: "Hộp",
      options: this.remoteSettings ? this.remoteSettings.boxConditions : [],
      onLaunchOptionChooser: () => {
        this.setState({ pickerVisible: true, currentPicker: PickerType.BoxCondition });
      }
    }
  ];

  public constructor(props: any) {
    super(props);
    this.state = {
      pickerVisible: false,
      shoeSize: undefined,
      shoeCondition: "",
      boxCondition: "",
      isSelectingShoeSize: false,
      isShowingPicker: false,
      currentPicker: undefined
    };
  }

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView style={{ flex: 1, width: Dimensions.get("screen").width }}>
        {this._renderShoeSelectionModal()}
        <View style={{ flexDirection: "column" }}>
          {this.settingsAndOptions.map((setting, index) =>
            this._renderSettingWithOptions(setting, index)
          )}
        </View>
        {this._renderPicker()}
      </SafeAreaView>
    );
  }

  private _renderSettingWithOptions(setting: Setting, index: number): JSX.Element {
    const defaultOption = "Lựa chọn";

    return (
      <View style={styles.settingContainer} key={index}>
        <Text.Body>{setting.title}</Text.Body>
        <TouchableOpacity onPress={() => setting.onLaunchOptionChooser()}>
          <Text.Body style={{ color: Assets.Styles.AppPrimaryColor }}>
            {this.state[setting.stateName] || defaultOption}
          </Text.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _renderShoeSelectionModal(): JSX.Element {
    return (
      <ShoeSizePicker
        shouldRenderCounter={false}
        pickerTitle={"Bạn đang muốn bán cỡ giày"}
        visible={this.state.isSelectingShoeSize}
        onTogglePicker={(
          exiting: boolean,
          owned: string | Array<{ shoeSize: string; number: number }>
        ) => {
          typeof owned === "string" &&
            this.setState(
              {
                shoeSize: owned,
                isSelectingShoeSize: false
              },
              () => {
                !exiting && this.props.onSetShoeSize(owned);
              }
            );
        }}
      />
    );
  }

  private _renderPicker(): JSX.Element | null {
    let currentPickedSettings: Setting | null = null;
    let onPickerSelected: (pickerOption: string) => void;
    switch (this.state.currentPicker) {
      case PickerType.BoxCondition:
        currentPickedSettings = this.settingsAndOptions[2];
        onPickerSelected = (pickerOption: string) => {
          this.props.onSetBoxCondition(pickerOption);
        };
        break;
      case PickerType.ShoeCondition:
        currentPickedSettings = this.settingsAndOptions[1];
        onPickerSelected = (pickerOption: string) => {
          this.props.onSetShoeCondition(pickerOption);
        };
        break;
      default:
        break;
    }

    if (currentPickedSettings !== null) {
      const { stateName, options } = currentPickedSettings;
      return (
        <CustomPicker
          options={options}
          visible={this.state.pickerVisible}
          optionLabelToString={item => item}
          onSelectPickerOK={(selectedValue: string) => {
            this.setState(prevState => {
              onPickerSelected(selectedValue);
              return {
                ...prevState,
                [stateName]: selectedValue,
                currentPicker: undefined
              };
            });
          }}
          onSelectPickerCancel={() => this.setState({ pickerVisible: false })}
        />
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },

  buttonSelected: {
    backgroundColor: "#1ABC9C"
  },

  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    marginHorizontal: 20
  },

  shoeSizesContainer: {
    position: "relative",
    flex: 1,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.9)",
    paddingHorizontal: 20
  },

  footerButton: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 0,
    height: Assets.Styles.ButtonHeight
  },

  footerContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    paddingBottom: getInset("bottom")
  }
});
