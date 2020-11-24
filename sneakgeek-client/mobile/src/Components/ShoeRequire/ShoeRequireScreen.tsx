import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  StackActions,
  NavigationScreenProps,
  NavigationScreenProp,
  NavigationRoute,
} from "react-navigation";
import * as Assets from "../../Assets";
import { ScrollView } from 'react-native-gesture-handler';
import { IAppSettingsService } from "../../Service/AppSettingsService";
import { container, Types } from "../../Config/Inversify";
import { CustomPicker, ShoeSizePicker } from "../../Shared/UI";
import ImagePicker, { ImagePickerResponse } from "react-native-image-picker";
import { NetworkRequestState } from "../../Shared/State";

enum PickerType {
  ShoeCondition = "ShoeCondition",
  BoxCondition = "BoxCondition",
  ShoeBrand = "ShoeBrand",
  Gender = "Gender",
  ShoeSize = "",
}

export interface IShoeRequireScreenProps {
  navigation?: NavigationScreenProp<NavigationRoute>;
  requestProductState: NetworkRequestState;
  navigateToRequireSuccess: (shoeName: String) => void;
  sendRequestProduct: (title: string, brand: string,
    // gender: string, colorways: string[], productLink: string, imageUrls: string[]
  ) => void;
}

export interface IShoeRequireScreenState {
  shoeSize?: string;
  currentPicker?: PickerType;
  isSelectingShoeSize: boolean;
  pickerVisible: boolean;
  shoeCondition: string;
  boxCondition: string;
  gender: string;
  shoeBrand: string;
  title: string;
  requireOrderInfo: object;
  imageUrls: string[];

  [key: string]: any;

}

type Setting = {
  readonly stateName: string;
  readonly title: string;
  readonly options: string[];
  readonly onLaunchOptionChooser: () => void;
};

export class ShoeRequireScreen extends React.Component<IShoeRequireScreenProps, IShoeRequireScreenState> {

  private appSettings: IAppSettingsService = container.get<IAppSettingsService>(
    Types.IAppSettingsService
  );
  private remoteSettings = this.appSettings.getSettings().RemoteSettings;

  static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    headerStyle: ({
      borderBottomWidth: 0,
    })
    ,
    title: "Yêu cầu sản phẩm",
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.popToTop())}
      />
    ),
    headerRight: (
      <Icon
        type={"ionicon"}
        name={"ios-share"}
        size={28}
        containerStyle={{ marginRight: 10 }}
      />
    )
  });

  public constructor(props: any) {
    super(props);
    this.state = {
      pickerVisible: false,
      isSelectingShoeSize: false,
      shoeSize: undefined,
      shoeCondition: "",
      boxCondition: "",
      shoeBrand: "",
      currentPicker: undefined,
      requireOrderInfo: {},
      title: this.props.navigation ? this.props.navigation.getParam("shoeName") : "",
      gender: "",
      imageUrls: [],
    };
  }


  public componentDidUpdate(prevProps: IShoeRequireScreenProps) {
    if (
      prevProps.requestProductState !== this.props.requestProductState &&
      this.props.requestProductState === NetworkRequestState.SUCCESS
    ) {
      this.props.navigateToRequireSuccess(this.state.title)
    }
    if (
      prevProps.requestProductState !== this.props.requestProductState &&
      this.props.requestProductState === NetworkRequestState.FAILED
    ) {
      Alert.alert('Thông báo', 'Đã xảy ra lỗi!')
    }
  }

  private readonly imagePickerOptions = {
    title: "Upload images",
    storageOptions: {
      skipBackup: true,
      path: "images"
    }
  };

  private settingsAndOptions: Setting[] = [
    {
      stateName: "shoeBrand",
      title: "THƯƠNG HIỆU",
      options: this.remoteSettings ? this.remoteSettings.shoeBrands : [],
      onLaunchOptionChooser: () => {
        this.setState({ pickerVisible: true, currentPicker: PickerType.ShoeBrand });
      }
    },
    {
      stateName: "gender",
      title: "GIỚI TÍNH",
      options: this.remoteSettings ? this.remoteSettings.genders : [],
      onLaunchOptionChooser: () => {
        this.setState({ pickerVisible: true, currentPicker: PickerType.Gender });
      }
    },
    {
      stateName: "shoeSize",
      title: "CỠ GIÀY",
      options: this.remoteSettings ? this.remoteSettings.shoeSizes.Adult : [],
      onLaunchOptionChooser: () => {
        // this.setState({ isSelectingShoeSize: true });
        this.setState({ pickerVisible: true, currentPicker: PickerType.ShoeSize });
      }
    },
    {
      stateName: "shoeCondition",
      title: "TÌNH TRẠNG",
      options: this.remoteSettings ? this.remoteSettings.shoeConditions : [],
      onLaunchOptionChooser: () => {
        this.setState({ pickerVisible: true, currentPicker: PickerType.ShoeCondition });
      }
    },

  ];

  public render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: 'white'
        }}
      >
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
            {this.renderUpImage()}
            {this._renderShoeSelectionModal()}
            {this.settingsAndOptions.map((setting, index) =>
              this._renderSettingWithOptions(setting, index)
            )}
            {this._renderPicker()}
          </ScrollView>
          {this.renderButton()}
        </View>
      </SafeAreaView>
    )
  }

  private renderUpImage() {
    return (
      <View style={styles.row}>
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={this._launchSystemImagePicker.bind(this)}>
          {this.state.imageUrls.length > 0 ?
            <Image source={{ uri: this.state.imageUrls[0] }} style={styles.image} />
            :
            <Image source={Assets.Icons.ContainerCamera} style={styles.containerCamera} />
          }
        </TouchableOpacity>
        <View>
          <TextInput
            autoFocus
            placeholder="Tên giầy yêu cầu"
            style={[styles.name]}
            value={this.state.title}
            underlineColorAndroid="transparent"
            onChangeText={(text) => { this.setState({ title: text }) }}
          />
          <Text style={[styles.descrip, {fontSize: 12, paddingTop: 10}]}>Bạn nên nêu rõ phối màu trong tên giày</Text>
        </View>
      </View>
    )
  }

  private _launchSystemImagePicker(): void {
    ImagePicker.launchImageLibrary(
      this.imagePickerOptions,
      (response: ImagePickerResponse) => {
        console.log('anh da chon', response)
        if (!response.didCancel && !response.error) {
          let imgs = [response.uri]
          this.setState({ imageUrls: imgs })
        }
      }
    );
  }

  private _renderSettingWithOptions(setting: Setting, index: number): JSX.Element {
    const defaultOption = "Lựa chọn";

    return (
      <View style={styles.settingContainer} key={index}>
        <Text style={styles.title}>{setting.title}</Text>
        <TouchableOpacity onPress={() => setting.onLaunchOptionChooser()}>
          <Text style={styles.descrip}>
            {this.state[setting.stateName] || defaultOption}
          </Text>
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
                !exiting && this._setShoeSize(owned);
              }
            );
        }}
      />
    );
  }

  private renderButton() {
    return (
      <TouchableOpacity style={styles.buttonContainer}
        onPress={this._onConfirm.bind(this)}
      >
        <Text style={styles.titleButton}>TIẾP TỤC</Text>
      </TouchableOpacity>
    )
  }

  private _renderPicker(): JSX.Element | null {
    let currentPickedSettings: Setting | null = null;
    let onPickerSelected: (pickerOption: string) => void;
    switch (this.state.currentPicker) {
      case PickerType.ShoeBrand:
        currentPickedSettings = this.settingsAndOptions[0];
        onPickerSelected = (pickerOption: string) => {
          this._setShoeBrand(pickerOption);
        };
        break;
      case PickerType.Gender:
        currentPickedSettings = this.settingsAndOptions[1];
        onPickerSelected = (pickerOption: string) => {
          this._setGender(pickerOption);
        };
        break;
      case PickerType.ShoeSize:
        currentPickedSettings = this.settingsAndOptions[2];
        onPickerSelected = (pickerOption: string) => {
          this._setShoeSize(pickerOption);
        };
        break;
      case PickerType.ShoeCondition:
        currentPickedSettings = this.settingsAndOptions[3];
        onPickerSelected = (pickerOption: string) => {
          this._setShoeCondition(pickerOption);
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

  private async _onConfirm() {
    await this.setState({
      requireOrderInfo: {
        title: this.state.title,
        brand: this.state.shoeBrand,
        gender: this.state.gender,
        productLink: "",
        imageUrls: this.state.imageUrls,
      }
    });
    await this.props.sendRequestProduct(this.state.title, this.state.shoeBrand,
      //  this.state.gender, [this.state.color], "", this.state.imageUrls
    )

  }

  private _setShoeSize(shoeSize: string) {
    this.setState({ shoeSize })
  }

  private _setShoeBrand(shoeBrand: string) {
    this.setState({ shoeBrand })
  }

  private _setGender(gender: string) {
    this.setState({ gender })
  }

  private _setShoeCondition(shoeCondition: string) {
    this.setState({ shoeCondition })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
  },
  containerCamera: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  image: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 20,
    fontFamily: 'RobotoCondensed-Regular',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 37,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed-Bold',
    opacity: 0.6
  },
  descrip: {
    fontSize: 17,
    fontFamily: 'RobotoCondensed-Regular',
    color: Assets.Styles.AppPrimaryColor,
  },
  buttonContainer: {
    backgroundColor: 'black',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    fontSize: 17,
    fontFamily: 'RobotoCondensed-Bold',
    color: 'white',
  },
  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    marginHorizontal: 20
  },
})