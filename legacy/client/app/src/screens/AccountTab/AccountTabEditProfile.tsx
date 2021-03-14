import React from 'react';
import {AppText, BottomButton, BottomPicker} from 'screens/Shared';
import {
  Profile,
  IAccountService,
  FactoryKeys,
  updateProfile,
  Ward,
  District,
} from 'business';
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  EmitterSubscription,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {ScrollView, TextInput, StyleSheet} from 'react-native';
import {
  StackNavigationProp,
  HeaderHeightContext,
} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements';
import {connect} from 'utilities/ReduxUtilities';
import {IAppState} from 'store/AppStore';
import {showSuccessNotification, toggleIndicator} from 'actions';
import {getToken, getDependency} from 'utilities';
import {RootStackParams} from 'navigations/RootStack';
import _, {values} from 'lodash';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },

  title: {
    marginVertical: 50,
    fontSize: 24,
  },

  contentContainer: {
    marginVertical: 100,
  },

  passwordContainer: {
    marginVertical: 50,
  },

  addressContainer: {
    marginVertical: 50,
  },

  infoButton: {
    backgroundColor: '#E5E5E5',
    color: '#FFFFFF',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: themes.RegularButtonHeight,
    borderTopWidth: 0.5,
    borderTopColor: themes.DisabledColor,
  },

  logoutText: {
    fontSize: 16,
    color: 'red',
  },

  bottomButtonContainer: {
    backgroundColor: themes.AppPrimaryColor,
    bottom: 10,
    borderRadius: themes.LargeBorderRadius,
  },

  input: {
    flex: 2,
    textAlign: 'right',
  },

  backHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  settingContainer: {
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});

type Props = {
  profile: Profile;
  navigation?: StackNavigationProp<RootStackParams, 'AccountTabEditProfile'>;

  updateProfile: (profile: Profile) => void;
  showNotification: (message: string) => void;
  toggleLoadingIndicator: (isLoading: boolean) => void;
};

enum PickerType {
  GENDER,
  SHOE_SIZE,
  CITY,
  DISTRICT,
  WARD,
}

type State = {
  editMode: boolean;
  updatedInfo?: Profile;
  shouldShowConfirm: boolean;
  pickerVisible: boolean;
  pickerType: PickerType;
  addressModalVisible: boolean;
};

type Setting = {
  title: string;
  placeholder: string;
  isPicker?: boolean;
  pickerType?: PickerType;
  value: (profile: Profile) => string | number;
  options?: () => Array<string | number>;
  onUpdate?: (value: string, profile: Profile) => Profile;
  onPress?: () => void;
};

type SettingSection = {
  sectionName: string;
  sectionFields: Array<Setting>;
};

@connect(
  (state: IAppState) => ({
    profile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    updateProfile: (profile: Profile): void => {
      dispatch(updateProfile(profile));
    },
    toggleLoadingIndicator: (isLoading: boolean): void => {
      dispatch(toggleIndicator({isLoading, message: strings.PleaseWait}));
    },
    showNotification: (message: string): void =>
      dispatch(showSuccessNotification(message)),
  }),
)
export class AccountTabEditProfile extends React.Component<Props, State> {
  private sectionList: Array<SettingSection> = [];
  private _addressLine1OnUpdateDelayed: _.DebouncedFunc<any>;

  public constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false,
      updatedInfo: Object.assign({}, props.profile),
      shouldShowConfirm: true,
      pickerVisible: false,
      pickerType: undefined,
      addressModalVisible: false,
    };

    this._addressLine1OnUpdateDelayed = _.debounce(
      this._addressLine1OnUpdate,
      2000,
    );

    this.sectionList = [
      {
        sectionName: 'Thông tin cá nhân',
        sectionFields: [
          {
            title: 'Họ',
            placeholder: 'Họ',
            value: (profile: Profile): string =>
              profile && profile.userProvidedName
                ? profile.userProvidedName.lastName
                : '',
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedName: {
                  ...profile.userProvidedName,
                  lastName: value,
                },
              });
            },
          },
          {
            title: 'Tên',
            placeholder: 'Tên',
            value: (profile?: Profile): string =>
              profile && profile.userProvidedName
                ? profile.userProvidedName.firstName
                : '',
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedName: {
                  ...profile.userProvidedName,
                  firstName: value,
                },
              });
            },
          },
          {
            title: 'Giới tính',
            placeholder: 'Giới tính',
            isPicker: true,
            pickerType: PickerType.GENDER,
            options: (): string[] => ['Nam', 'Nữ', 'Khác'],
            value: (profile: Profile): string => profile?.userProvidedGender,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedGender: value,
              });
            },
          },
          {
            title: 'Email',
            placeholder: 'Email',
            value: (profile: Profile): string => profile?.userProvidedEmail,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedEmail: value,
              });
            },
          },
          {
            title: 'Điện thoại',
            placeholder: 'Điện thoại',
            value: (profile: Profile): string =>
              profile?.userProvidedPhoneNumber,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedPhoneNumber: value,
              });
            },
          },
        ],
      },
      {
        sectionName: 'Địa chỉ giao hàng',
        sectionFields: [
          {
            title: 'Địa chỉ 1',
            placeholder: 'Đường/phố, quận/huyện, tỉnh/thành phố',
            isPicker: false,
            value: (profile: Profile): string =>
              profile?.userProvidedAddress?.addressLine1,
            onPress: () => {
              this.setState({addressModalVisible: true});
            },
          },
          {
            title: 'Địa chỉ 2',
            placeholder: 'Ngõ, ngách, số phòng,...',
            isPicker: false,
            value: (profile: Profile): string =>
              profile?.userProvidedAddress?.addressLine2,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedAddress: {
                  ...profile.userProvidedAddress,
                  addressLine2: value,
                },
              });
            },
          },
        ],
      },
    ];

    if (this.props.profile?.isSeller) {
      this.sectionList.push({
        sectionName: 'Tài khoản ngân hàng',
        sectionFields: [
          {
            title: 'Số tài khoản',
            placeholder: '01234567879',
            isPicker: false,
            value: (profile: Profile): string => '',
            onUpdate: (value: string, profile: Profile): Profile => profile,
          },
          {
            title: 'Chi nhánh',
            placeholder: 'BIDV chi nhánh Đống Đa',
            isPicker: false,
            value: (profile: Profile): string => '',
            onUpdate: (values: string, profile: Profile): Profile => profile,
          },
        ],
      });
    }
  }

  private _keyboardShowListener: EmitterSubscription;
  private _keyboardHideListener: EmitterSubscription;
  private readonly _accountService = getDependency<IAccountService>(
    FactoryKeys.IAccountService,
  );
  private _validShippingAddress: {
    districts: District[];
    wards: Map<number, Ward[]>;
  };

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <KeyboardAvoidingView
            behavior={'height'}
            style={{
              paddingTop: insets.top,
              ...styles.rootContainer,
            }}>
            {this._renderHeader(insets.top)}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                marginBottom: this.state.editMode
                  ? themes.RegularButtonHeight
                  : 0,
              }}>
              {this._renderSettingSections()}
            </ScrollView>
            {this._renderPicker()}
            {this._renderUpdateButton()}
            {this._renderAddressModal()}
          </KeyboardAvoidingView>
        )}
      </SafeAreaConsumer>
    );
  }

  public componentDidMount(): void {
    this._keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.setState({shouldShowConfirm: false});
    });

    this._keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({shouldShowConfirm: true});
    });
  }

  public componentWillUnmount(): void {
    this._keyboardHideListener.remove();
    this._keyboardShowListener.remove();
    this._addressLine1OnUpdateDelayed.cancel();
  }

  private _renderAddressModal() {
    return (
      <Modal
        visible={this.state.addressModalVisible}
        hardwareAccelerated={true}
        animationType={'slide'}
        presentationStyle={'formSheet'}
        onRequestClose={() => this.setState({addressModalVisible: false})}>
        <View style={{flex: 1, position: 'relative'}}>
          <Icon
            name={'close'}
            size={themes.IconSize * 1.5}
            onPress={() => this.setState({addressModalVisible: false})}
            containerStyle={{position: 'absolute', right: 15, top: 15}}
          />
          <AppText.Title3 style={{margin: 20, marginTop: 30}}>
            Tìm kiếm địa chỉ
          </AppText.Title3>

          <GooglePlacesAutocomplete
            placeholder={strings.Address}
            textInputProps={{
              autoFocus: this.state.addressModalVisible,
            }}
            query={{
              key: 'AIzaSyDlfZb9snIlXHI-vn6zeaIAJfR3lWJmGlI',
              language: 'vi',
              components: 'country:vn',
            }}
            onPress={(data) => {
              let info = this.state.updatedInfo;
              info = {
                ...info,
                userProvidedAddress: {
                  ...info.userProvidedAddress,
                  addressLine1: data.description,
                },
              };

              this.setState({
                addressModalVisible: false,
                updatedInfo: info,
              });
            }}
            styles={{
              textInput: themes.TextStyle.body,
              container: {flex: 1},
              description: themes.TextStyle.callout,
            }}
          />
        </View>
      </Modal>
    );
  }

  private _renderHeader(topInsets: number): JSX.Element {
    return (
      <HeaderHeightContext.Consumer>
        {(headerHeight): JSX.Element => (
          <View
            style={{
              ...styles.headerContainer,
              height:
                headerHeight > 0
                  ? headerHeight + topInsets
                  : themes.IosHeaderHeight,
            }}>
            <Icon
              name={'ios-arrow-back'}
              type={'ionicon'}
              size={themes.IconSize}
              onPress={(): void => this.props.navigation.goBack()}
              hitSlop={styles.backHitSlop}
            />
            <AppText.Title3>{strings.AccountInfo}</AppText.Title3>
            <Icon
              name={this.state.editMode ? 'x' : 'edit'}
              type={'feather'}
              size={themes.IconSize}
              onPress={(): void =>
                this.setState({editMode: !this.state.editMode})
              }
            />
          </View>
        )}
      </HeaderHeightContext.Consumer>
    );
  }

  private _renderSettingSections(): JSX.Element {
    return (
      <View>
        {this.sectionList.map((item, i) => (
          <View key={i} style={{marginVertical: 15}}>
            <AppText.Headline style={{marginVertical: 8, marginLeft: 15}}>
              {item.sectionName}
            </AppText.Headline>
            {this._renderSettings(item.sectionFields)}
          </View>
        ))}
      </View>
    );
  }

  private _renderSettings(options: Array<Setting>): JSX.Element {
    return (
      <View style={styles.settingContainer}>
        {options.map((item, i) => (
          <TouchableWithoutFeedback
            key={i}
            onPress={(): void => {
              if (item.isPicker && this.state.editMode) {
                this.setState({
                  pickerVisible: true,
                  pickerType: item.pickerType,
                });
              }
            }}>
            <View style={styles.listItem}>
              <AppText.Body style={{flex: 1}}>{item.title}</AppText.Body>
              {this._renderSetting(item)}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  }

  private _renderSetting(item: Setting): JSX.Element {
    const {updatedInfo, editMode} = this.state;
    const {profile} = this.props;
    const textValue =
      updatedInfo && item.value(updatedInfo)
        ? item.value(updatedInfo).toString()
        : '';

    if (editMode && !item.isPicker) {
      return (
        <TextInput
          value={textValue}
          placeholder={item.placeholder}
          onChangeText={(value): void => {
            if (updatedInfo && item.onUpdate) {
              const newProfile = item.onUpdate(value, updatedInfo);
              this.setState({updatedInfo: newProfile});
            }
          }}
          onTouchStart={() => {
            if (item.onPress) {
              item.onPress();
            }
          }}
          style={[styles.input, themes.TextStyle.subhead]}
        />
      );
    } else if (editMode && item.isPicker) {
      return (
        <AppText.Subhead style={styles.input}>{textValue}</AppText.Subhead>
      );
    }

    return (
      <AppText.Subhead style={styles.input}>
        {item.value(profile)}
      </AppText.Subhead>
    );
  }

  private _renderPicker(): JSX.Element {
    if (!this.state.pickerVisible) {
      return null;
    }

    const setting = this.sectionList
      .map((t) => t.sectionFields)
      .reduce((x, y) => x.concat(y))
      .find((t) => t.pickerType === this.state.pickerType);

    return (
      <BottomPicker
        options={setting.options?.()}
        visible={this.state.pickerVisible}
        onSelectPickerOK={(value: string): void => {
          this.setState({
            pickerVisible: false,
            pickerType: undefined,
            updatedInfo: setting.onUpdate(value, this.state.updatedInfo),
          });
        }}
        onSelectPickerCancel={(): void =>
          this.setState({pickerVisible: false, pickerType: undefined})
        }
        optionLabelToString={(t): string => t.toString()}
      />
    );
  }

  private _renderUpdateButton(): JSX.Element | null {
    const {shouldShowConfirm, editMode} = this.state;

    if (!shouldShowConfirm || !editMode) {
      return null;
    }

    return (
      <BottomButton
        onPress={this._updateProfile.bind(this)}
        title={'Xác nhận'}
        style={styles.bottomButtonContainer}
      />
    );
  }

  private async _updateProfile(): Promise<void> {
    try {
      const profile = await this._accountService.updateProfile(
        getToken(),
        this.state.updatedInfo,
      );
      this.props.showNotification('Cập nhật thông tin cá nhân thành công');
      this.props.updateProfile(profile);
    } catch (error) {
      this.props.showNotification('Đã có lỗi khi xảy ra, xin vui lòng thử lại');
    } finally {
      this.setState({updatedInfo: this.props.profile, editMode: false});
    }
  }

  private _addressLine1OnUpdate(value: string): void {}
}
