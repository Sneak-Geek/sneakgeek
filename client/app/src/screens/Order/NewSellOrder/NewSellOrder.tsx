import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
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
import {TextInputMask} from 'react-native-masked-text';

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
  numText: Array<string>;
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
  private MoneyField: TextInputMask

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
      numText: ['', '', '']
    };
  }

  onUpdate = (text, index) => {
    if (index == 0)
    {
      this.setState({
        inventory: {
          ...this.state.inventory,
          shoeSize: text,
        },
        numText: [text, this.state.numText[1], this.state.numText[2]],
      })
    }
    if (index == 1)
    {
      this.setState({
        inventory: {
          ...this.state.inventory,
          quantity: parseInt(text, 10),
        },
        numText: [this.state.numText[0], text, this.state.numText[2]],
      })
    }
    if (index == 2)
    {
      this.setState({
        inventory: {
          ...this.state.inventory,
          sellPrice: parseInt(this.MoneyField.getRawValue(), 10) * 10,
        },
        numText: [this.state.numText[0], this.state.numText[1], text],
      })
    }
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
      },
      {
        title: strings.InventoryQuantity,
        displayText: '',
      },
      {
        title: strings.Price,
        displayText: '',
      },
    ];

    return (
      <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
        {inventoryItems.map((t, index) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <AppText.SubHeadline>{t.title}</AppText.SubHeadline>
            <TextInputMask
              placeholderTextColor={themes.AppDisabledColor}
              placeholder={t.title}
              numberOfLines={1}
              keyboardType={'number-pad'}
              type={index === 2 ? 'money' : 'custom'}
              options={
                index === 2 ? 
                {
                  precision: 0,
                  separator: '.',
                  delimiter: '.',
                  unit: '',
                  suffixUnit: ''
                } : 
                {
                  mask: '****'
                } 
              }
              value={this.state.numText[index]}
              onChangeText={text => this.onUpdate(text, index)}
              style={{...themes.TextStyle.body, marginBottom: 20}}
              ref={(ref) => {index === 2 ? this.MoneyField = ref : undefined}}
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

