//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  ISettingsProvider,
  ObjectFactory as Factory,
  FactoryKeys,
  SettingsKey,
  SellOrder,
} from 'business';
import {AppText, BottomPicker} from 'screens/Shared';
import {themes} from 'resources';

enum PickerType {
  ShoeSize = 'ShoeSize',
  ShoeCondition = 'ShoeCondition',
  BoxCondition = 'BoxCondition',
}

type Props = {
  order?: Partial<SellOrder>;
  onSetShoeSize: (shoeSize: string) => void;
  onSetShoeCondition: (shoeCondition: string) => void;
  onSetBoxCondition: (boxCondition: string) => void;
};

type State = {
  shoeSize: string;
  shoeCondition: string;
  boxCondition: string;
  isShowingPicker: boolean;
  pickerVisible: boolean;
  currentPicker?: PickerType;

  // indexing purpose
  [key: string]: any;
};

type Setting = {
  readonly currentValue?: string;
  readonly stateName: string;
  readonly title: string;
  readonly options: string[];
  readonly onLaunchOptionChooser: () => void;
};

export class ProductRequiredInfo extends React.PureComponent<Props, State> {
  private appSettings: ISettingsProvider;
  private remoteSettings: Record<string, any>;
  private settings: Setting[];

  public constructor(props: any) {
    super(props);
    this.state = {
      pickerVisible: false,
      shoeSize: this.props.order?.shoeSize,
      shoeCondition: '',
      boxCondition: '',
      isSelectingShoeSize: false,
      isShowingPicker: false,
      currentPicker: undefined,
    };
    this.appSettings = Factory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider,
    );
    this.remoteSettings = this.appSettings.getValue(SettingsKey.RemoteSettings);

    this.settings = [
      {
        stateName: 'shoeSize',
        title: 'Cỡ giày',
        options: this.remoteSettings ? this.remoteSettings.shoeSizes.Adult : [],
        onLaunchOptionChooser: () => {
          this.setState({
            pickerVisible: true,
            currentPicker: PickerType.ShoeSize,
          });
        },
      },
      {
        stateName: 'shoeCondition',
        title: 'Tình trạng',
        options: this.remoteSettings ? this.remoteSettings.shoeConditions : [],
        onLaunchOptionChooser: () => {
          this.setState({
            pickerVisible: true,
            currentPicker: PickerType.ShoeCondition,
          });
        },
      },
      {
        stateName: 'boxCondition',
        title: 'Hộp',
        options: this.remoteSettings ? this.remoteSettings.boxConditions : [],
        onLaunchOptionChooser: () => {
          this.setState({
            pickerVisible: true,
            currentPicker: PickerType.BoxCondition,
          });
        },
      },
    ];
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, width: Dimensions.get('screen').width}}>
        <View style={{flexDirection: 'column'}}>
          {this.settings.map((setting, index) =>
            this._renderSettingWithOptions(setting, index),
          )}
        </View>
        {this._renderPicker()}
      </SafeAreaView>
    );
  }

  private _renderSettingWithOptions(
    setting: Setting,
    index: number,
  ): JSX.Element {
    const defaultOption = 'Lựa chọn';

    return (
      <View style={styles.settingContainer} key={index}>
        <AppText.Body>{setting.title}</AppText.Body>
        <TouchableOpacity onPress={() => setting.onLaunchOptionChooser()}>
          <AppText.Body style={{color: themes.AppPrimaryColor}}>
            {this.state[setting.stateName] || defaultOption}
          </AppText.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _renderPicker(): JSX.Element | null {
    let currentPickedSettings: Setting | null = null;
    let onPickerSelected: (pickerOption: string) => void;
    switch (this.state.currentPicker) {
      case PickerType.ShoeSize:
        currentPickedSettings = this.settings[0];
        onPickerSelected = (pickerOption: string): void => {
          this.props.onSetShoeSize(pickerOption);
        };
        break;
      case PickerType.BoxCondition:
        currentPickedSettings = this.settings[2];
        onPickerSelected = (pickerOption: string): void => {
          this.props.onSetBoxCondition(pickerOption);
        };
        break;
      case PickerType.ShoeCondition:
        currentPickedSettings = this.settings[1];
        onPickerSelected = (pickerOption: string): void => {
          this.props.onSetShoeCondition(pickerOption);
        };
        break;
      default:
        break;
    }

    if (this.state.pickerVisible) {
      const {stateName, options} = currentPickedSettings;
      return (
        <BottomPicker
          currentValue={currentPickedSettings.currentValue}
          visible={this.state.pickerVisible}
          options={options}
          optionLabelToString={(option: string): string => option}
          onSelectPickerOK={(selectedValue: string): void => {
            this.setState(
              {
                pickerVisible: false,
                [stateName]: selectedValue,
              },
              () => onPickerSelected(selectedValue),
            );
          }}
          onSelectPickerCancel={(): void =>
            this.setState({pickerVisible: false})
          }
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  buttonSelected: {
    backgroundColor: '#1ABC9C',
  },

  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    marginHorizontal: 20,
  },

  shoeSizesContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.9)',
    paddingHorizontal: 20,
  },

  footerButton: {
    width: Dimensions.get('window').width / 2,
    borderRadius: 0,
    height: themes.RegularButtonHeight,
  },

  footerContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
  },
});
