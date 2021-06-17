import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {themes, strings} from 'resources';
import {
  ShoeHeaderSummary,
  BottomButton,
  AppText,
  DismissKeyboardView,
} from 'screens/Shared';
import {Shoe, FactoryKeys, Profile, Inventory} from 'business';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {connect, getToken, getDependency} from 'utilities';
import {
  showErrorNotification,
  showSuccessNotification,
  toggleIndicator,
} from 'actions';
import {IInventoryService} from 'business/src';
import {IAppState} from 'store/AppStore';
import RouteNames from 'navigations/RouteNames';

type Props = {
  userProfile: Profile;
  route: RouteProp<RootStackParams, 'NewSellOrder'>;
  navigation: StackNavigationProp<RootStackParams, 'NewSellOrder'>;

  showErrorNotification: (message: string) => void;
  showSuccessNotification: (message: string) => void;
  toggleLoading: (isLoading: boolean) => void;
};

type SellDetailChild = {
  render: () => JSX.Element;
  canProceed: () => boolean;
};

type State = {
  inventory: Partial<Inventory>;
};

@connect(
  (state: IAppState) => ({
    userProfile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    toggleLoading: (isLoading: boolean) => {
      dispatch(toggleIndicator({isLoading, message: strings.PleaseWait}));
    },
    showErrorNotification: (message: string): void => {
      dispatch(showErrorNotification(message));
    },
    showSuccessNotification: (message: string): void => {
      dispatch(showSuccessNotification(message));
    },
  }),
)
export class NewSellOrder extends React.Component<Props, State> {
  private _shoe: Shoe;

  public constructor(props: Props) {
    super(props);

    try {
      this._shoe = this.props.route.params.shoe;
    } catch (error) {
        props.navigation.navigate(RouteNames.Tab.HomeTab.Name, {
        screen: RouteNames.Tab.HomeTab.Main,
      });
    }

    this.state = {
      inventory: {
        sellPrice: undefined,
        shoeId: (this._shoe !== undefined) ? this._shoe._id: undefined,
        shoeSize: undefined,
        quantity: undefined,
      },
    };
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, paddingTop: 0}}>
        <DismissKeyboardView style={{flex: 1, backgroundColor: 'white'}}>
          <ShoeHeaderSummary shoe={this._shoe} />
          {this._renderInventory()}
          {this._renderBottomButton()}
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }

  private _renderInventory() {
    const inventoryItems = [
      {
        title: strings.ShoeSize,
        displayText: '',
        onUpdate: (text) => {
          this.setState({
            inventory: {
              ...this.state.inventory,
              shoeSize: text,
            },
          });
        },
      },
      {
        title: strings.InventoryQuantity,
        displayText: '',
        onUpdate: (text) => {
          this.setState({
            inventory: {
              ...this.state.inventory,
              quantity: parseInt(text, 10),
            },
          });
        },
      },
      {
        title: strings.Price,
        displayText: '',
        onUpdate: (text) => {
          this.setState({
            inventory: {
              ...this.state.inventory,
              sellPrice: parseInt(text, 10),
            },
          });
        },
      },
    ];
    return (
      <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
        {inventoryItems.map((t) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <AppText.SubHeadline>{t.title}</AppText.SubHeadline>
            <TextInput
              placeholderTextColor={themes.AppDisabledColor}
              placeholder={t.title}
              numberOfLines={1}
              style={{...themes.TextStyle.body, marginBottom: 20}}
              keyboardType={'numeric'}
              onChangeText={t.onUpdate}
            />
          </View>
        ))}
      </View>
    );
  }

  private _renderBottomButton() {
    return (
      <BottomButton
        title={strings.SellShoe.toUpperCase()}
        onPress={() => this._sellShoe()}
        style={{
          backgroundColor: themes.AppSecondaryColor,
          borderRadius: themes.LargeBorderRadius,
        }}
      />
    );
  }

  private async _sellShoe() {
    const token = getToken();
    const inventory = this.state.inventory;
    const inventoryService = getDependency<IInventoryService>(
      FactoryKeys.IInventoryService,
    );
    try {
      const {quantity, sellPrice, shoeSize} = inventory;
      if (!shoeSize) {
        this.props.showErrorNotification('Hãy nhập cỡ giày');
        return;
      } else if (!quantity) {
        this.props.showErrorNotification('Hãy nhập số lượng giày');
        return;
      } else if (!sellPrice) {
        this.props.showErrorNotification('Hãy nhập giá bán');
        return;
      }

      await inventoryService.createInventory(
        token,
        inventory.shoeId,
        inventory.quantity,
        inventory.sellPrice,
        inventory.shoeSize,
      );
      this.props.showSuccessNotification('Đã bán thành công sản phẩm!');
      this.props.navigation.goBack();
    } catch (error) {
      this.props.showErrorNotification(
        'Đã có lỗi xảy ra, xin vui lòng thử lại',
      );
    } finally {
      this.props.toggleLoading(false);
    }
  }
}
