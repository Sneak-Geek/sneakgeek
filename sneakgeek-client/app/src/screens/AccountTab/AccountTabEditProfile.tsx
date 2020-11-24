import React from 'react';
import {AppText, BottomButton, BottomPicker} from 'screens/Shared';
import {
  Profile,
  IAccountService,
  FactoryKeys,
  updateProfile,
  ISettingsProvider,
  ISettingService,
  SettingsKey,
  Ward,
  District,
} from 'business';
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  EmitterSubscription,
  TouchableWithoutFeedback,
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
};

type Setting = {
  title: string;
  placeholder: string;
  isPicker?: boolean;
  pickerType?: PickerType;
  value: (profile: Profile) => string | number;
  options?: () => Array<string | number>;
  onUpdate: (value: string, profile: Profile) => Profile;
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

  public constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false,
      updatedInfo: Object.assign({}, props.profile),
      shouldShowConfirm: true,
      pickerVisible: false,
      pickerType: undefined,
    };

    this.sectionList = [
      {
        sectionName: 'Thông tin cá nhân',
        sectionFields: [
          {
            title: 'Họ',
            placeholder: 'Họ',
            value: (profile: Profile): string =>
              profile.userProvidedName ? profile.userProvidedName.lastName : '',
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
            value: (profile: Profile): string =>
              profile.userProvidedName
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
            options: (): string[] => [],
            value: (profile: Profile): string => profile.userProvidedGender,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedGender: value,
              });
            },
          },
          {
            title: 'Email',
            placeholder: 'Email',
            value: (profile: Profile): string => profile.userProvidedEmail,
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
              profile.userProvidedPhoneNumber,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedPhoneNumber: value,
              });
            },
          },
        ],
      },
      {
        sectionName: 'Thông tin giày',
        sectionFields: [
          {
            title: 'Cỡ giày',
            placeholder: 'Cỡ giày',
            isPicker: true,
            pickerType: PickerType.SHOE_SIZE,
            options: (): string[] => [],
            value: (profile: Profile): string => profile.userProvidedShoeSize,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedShoeSize: value,
              });
            },
          },
        ],
      },
      {
        sectionName: 'Địa chỉ giao hàng',
        sectionFields: [
          {
            title: 'Địa chỉ',
            placeholder: 'Địa chỉ',
            isPicker: false,
            value: (profile: Profile): string =>
              profile?.userProvidedAddress?.streetAddress,
            onUpdate: (value: string, profile: Profile): Profile => {
              return Object.assign(profile, {
                userProvidedAddress: {
                  ...profile.userProvidedAddress,
                  streetAddress: value,
                },
              });
            },
          },
          {
            title: 'Tỉnh/Thành phố',
            placeholder: 'Tỉnh/Thành phố',
            isPicker: true,
            pickerType: PickerType.CITY,
            options: (): string[] => this._getCities(),
            value: (profile: Profile): string =>
              profile.userProvidedAddress?.city,
            onUpdate: (value: string, profile: Profile): Profile => ({
              ...profile,
              userProvidedAddress: {
                ...profile.userProvidedAddress,
                city: value,
              },
            }),
          },
          {
            title: 'Quận/Huyện',
            placeholder: 'Quận/Huyện',
            isPicker: true,
            pickerType: PickerType.DISTRICT,
            options: (): string[] => this._getDistricts(),
            value: (profile: Profile): string =>
              profile.userProvidedAddress?.district,
            onUpdate: (value: string, profile: Profile): Profile => ({
              ...profile,
              userProvidedAddress: {
                ...profile.userProvidedAddress,
                district: value,
                districtId: this._findDistrictId(value),
              },
            }),
          },
          {
            title: 'Phường/Xã',
            placeholder: 'Phường/Xã',
            isPicker: true,
            pickerType: PickerType.WARD,
            options: (): string[] => this._getWards(),
            value: (profile: Profile): string =>
              profile.userProvidedAddress?.ward,
            onUpdate: (value: string, profile: Profile): Profile => ({
              ...profile,
              userProvidedAddress: {
                ...profile.userProvidedAddress,
                ward: value,
                wardCode: this._findWardCode(value),
              },
            }),
          },
        ],
      },
    ];
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

    this._initializeAddressSettings();
  }

  private _initializeAddressSettings(): void {
    const settingsService = getDependency<ISettingService>(
      FactoryKeys.ISettingService,
    );
    const settingsProvider = getDependency<ISettingsProvider>(
      FactoryKeys.ISettingsProvider,
    );
    this._validShippingAddress = settingsProvider.getValue(
      SettingsKey.GhnShippingAddress,
    );

    if (!this._validShippingAddress) {
      this.props.toggleLoadingIndicator(true);
      settingsService
        .getValidShippingAddress(getToken())
        .then(async ({districts, wards}) => {
          await settingsProvider.setValue(SettingsKey.GhnShippingAddress, {
            districts,
            wards,
          });
          this._validShippingAddress = {districts, wards};
          this.props.toggleLoadingIndicator(false);
        });
    }
  }

  public componentWillUnmount(): void {
    this._keyboardHideListener.remove();
    this._keyboardShowListener.remove();
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
            if (updatedInfo) {
              const newProfile = item.onUpdate(value, updatedInfo);
              this.setState({updatedInfo: newProfile});
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

  private _findDistrictId(districtName: string): number {
    return this._validShippingAddress.districts.find(
      (t) => t.DistrictName === districtName,
    ).DistrictID;
  }

  private _findWardCode(ward: string): string {
    const {userProvidedAddress} = this.state.updatedInfo;
    if (
      userProvidedAddress &&
      userProvidedAddress.district &&
      userProvidedAddress.districtId
    ) {
      const wards = this._validShippingAddress.wards.get(
        userProvidedAddress.districtId,
      );

      return wards.find((t) => t.WardName === ward).WardCode;
    }

    return undefined;
  }

  private _getCities(): string[] {
    const cities = new Set(
      this._validShippingAddress.districts.map((t) => t.ProvinceName),
    );
    return Array.from(cities).sort();
  }

  private _getDistricts(): string[] {
    const selectedCity = this.state.updatedInfo.userProvidedAddress.city;

    return this._validShippingAddress.districts
      .filter((t) => t.ProvinceName === selectedCity)
      .map((t) => t.DistrictName)
      .sort();
  }

  private _getWards(): string[] {
    const district = this.state.updatedInfo.userProvidedAddress.district;
    const districtId = this._validShippingAddress.districts.find(
      (t) => t.DistrictName === district,
    ).DistrictID;
    return this._validShippingAddress.wards
      .get(districtId)
      .map((t) => t.WardName)
      .sort();
  }
}
