import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View, TextInput, TouchableOpacity, Linking} from 'react-native';
import {getDependency, getToken, toCurrencyString} from 'utilities';
import {
  IInventoryService,
  FactoryKeys,
  Inventory,
  ISettingsProvider,
  SettingsKey,
  Profile,
} from 'business';
import {useSelector} from 'react-redux';
import {IAppState} from 'store/AppStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AppText,
  BottomButton,
  BottomPicker,
  ShoeHeaderSummary,
} from 'screens/Shared';
import {strings, themes} from 'resources';
import {Shoe} from 'business/src';
import {SearchBar} from 'react-native-elements';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import RouteNames from 'navigations/RouteNames';
import {DismissKeyboardView} from 'screens/Shared';
import {SNKGKPickerRow} from './AccountTabEditProfile';
import {useDispatch} from 'react-redux';
import {showSuccessNotification} from 'actions';
import {useCallback} from 'react';
import {TextInputMask} from 'react-native-masked-text';

const styles = StyleSheet.create({
  inventoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: themes.AppDisabledColor,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  logInButtonContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 128,
    borderRadius: 8,
    backgroundColor: themes.AppSecondaryColor,
    paddingTop: 24,
    marginBottom: 16,
  },
  logInButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themes.AppPrimaryColor,
    width: 153,
    height: 52,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 16,
  },
  logInTextStyle: {
    color: 'white',
  },
});

type PickerState = {
  pickerVisible: boolean;
  pickerValue: string;
};

type TextInputState = {
  displayTextPrice: string
}

export const AccountTabInventoryDetail: React.FC<{}> = () => {
  const route = useRoute();
  const inventory: Inventory & {shoe: Shoe} = (route.params as any).inventory;
  var moneyField: TextInputMask;

  const [quantity, setQuantity] = useState<number>(inventory.quantity);
  const [pickerState, setPickerState] = useState<PickerState>({
    pickerVisible: false,
    pickerValue: inventory?.shoeSize,
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [price, setPrice] = useState<number>(inventory.sellPrice);
  const navigation = useNavigation();
  
  const [inputState, setInputState] = useState<TextInputState>({
    displayTextPrice: toCurrencyString(inventory.sellPrice),
  });
  
  const items = [
    {
      title: strings.Size,
      displayText: inventory.shoeSize,
      editable: false,
    },
    {
      title: strings.InventoryQuantity,
      displayText: quantity.toString(),
      editable: true,
      onUpdate: (text: string) => {
        setQuantity(parseInt(text, 10));
      },
    },
    {
      title: strings.Price,
      editable: true,
      onUpdate: (text: string) => {
        setPrice(parseInt(moneyField.getRawValue(), 10) * 10);
        setInputState({...inputState, displayTextPrice: text});
      },
    },
  ];

  let shoeSizeOptions = [];
  const settings: ISettingsProvider = getDependency(
    FactoryKeys.ISettingsProvider,
  );
  const remoteSettings: {
    shoeSizes: {
      Adult: Array<string>;
      GradeSchool: Array<string>;
      PreSchool: Array<string>;
      Toddler: Array<string>;
    };
  } = settings.getValue(SettingsKey.RemoteSettings);
  switch (inventory.shoe.gender) {
    case 'men':
    case 'women':
      shoeSizeOptions = remoteSettings.shoeSizes.Adult;
      break;
    case 'child':
      shoeSizeOptions = remoteSettings.shoeSizes.GradeSchool;
      break;
    case 'preschool':
      shoeSizeOptions = remoteSettings.shoeSizes.PreSchool;
      break;
    case 'toddler':
      shoeSizeOptions = remoteSettings.shoeSizes.Toddler;
      break;
  }

  return (
    <DismissKeyboardView
      style={{flex: 1, backgroundColor: 'white', paddingTop: 0}}>
      <ShoeHeaderSummary shoe={inventory.shoe} />
      <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
        {items.map((t) => {
          switch (t.title) {
            case strings.ShoeSize:
              // TO DO (DUC): Combine Picker Row with Picker Modal in AccountTabEditProfile
              return (
                <SNKGKPickerRow
                  style={{marginBottom: 20}}
                  title={t.title}
                  value={pickerState.pickerValue}
                  onPress={() =>
                    setPickerState({...pickerState, pickerVisible: true})
                  }
                />
              );
            case strings.Price:
              return (
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
                type= 'money'
                options={
                  {
                    precision: 0,
                    separator: '.',
                    delimiter: '.',
                    unit: '',
                    suffixUnit: '',
                  }
                }
                value={inputState.displayTextPrice}
                editable={t.editable}
                onChangeText={(text) => t.onUpdate(text)}
                style={{
                  ...themes.TextStyle.body,

                  textAlign: 'right',
                }}
                ref={(ref) => {moneyField = ref;}}
              />
              </View>);
            default:
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                  <AppText.SubHeadline>{t.title}</AppText.SubHeadline>
                  <TextInput
                    defaultValue={t.displayText}
                    numberOfLines={1}
                    editable={t.editable}
                    style={{
                      ...themes.TextStyle.body,

                      textAlign: 'right',
                    }}
                    keyboardType={'number-pad'}
                    onChangeText={t.onUpdate}
                  />
                </View>
              );
          }
        })}
      </View>
      <BottomButton
        disabled={submitted}
        style={{
          backgroundColor: 'white',
          borderRadius: themes.LargeBorderRadius,
          marginBottom: 80,
          alignSelf: 'flex-end',
        }}
        title={'Huỷ'}
        titleStyle={{color: themes.AppPrimaryColor}}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <BottomButton
        disabled={submitted}
        style={{
          backgroundColor: themes.AppSecondaryColor,
          borderRadius: themes.LargeBorderRadius,
          marginBottom: 10,
          alignSelf: 'flex-end',
        }}
        title={strings.Confirm}
        onPress={async () => {
          const token = await getToken(true);
          const inventoryService = getDependency<IInventoryService>(
            FactoryKeys.IInventoryService,
          );
          const updatedInventory = {
            // TO DO (DUC): Fix mismatch id key for Inventory type for be and fe
            id: inventory._id,
            sellerId: inventory.sellerId,
            shoeId: inventory.shoeId,
            shoeSize: pickerState.pickerValue,
            quantity,
            sellPrice: price,
          };
          setSubmitted(true);
          await inventoryService.updateInventory(token, updatedInventory);
          navigation.goBack();
          dispatch(showSuccessNotification('Thay đổi đơn hàng thành công!'));
        }}
      />
      {pickerState.pickerVisible ? (
        <BottomPicker
          options={shoeSizeOptions}
          visible={pickerState.pickerVisible}
          onSelectPickerOK={(value: string): void => {
            setPickerState({
              pickerVisible: false,
              pickerValue: value,
            });
          }}
          onSelectPickerCancel={(): void => {
            setPickerState({
              pickerVisible: false,
              pickerValue: inventory?.shoeSize,
            });
          }}
          optionLabelToString={(t): string => t.toString()}
        />
      ) : null}
    </DismissKeyboardView>
  );
};

const InventoryItem: React.FC<{inventory: Inventory & {shoe: Shoe}}> = (
  props,
) => {
  const inventory = props.inventory;
  const shoe = inventory.shoe;

  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      style={styles.inventoryContainer}
      onPress={() => {
        navigation.navigate(RouteNames.Tab.InventoryTab.InventoryDetail, {
          inventory,
        });
      }}>
      <Image
        source={{uri: inventory.shoe.media.thumbUrl}}
        style={{width: 100, aspectRatio: 1}}
        resizeMode={'contain'}
      />
      <View style={{marginLeft: 15, flexDirection: 'column', flex: 1}}>
        <AppText.SubHeadline style={{flexWrap: 'wrap', marginBottom: 10}}>
          {shoe.title}
        </AppText.SubHeadline>
        <AppText.Subhead style={{marginBottom: 5}}>
          {strings.Price}:{' '}
          <AppText.Body>{toCurrencyString(inventory.sellPrice)}</AppText.Body>
        </AppText.Subhead>
        <AppText.Subhead style={{marginBottom: 5}}>
          {strings.ShoeSize}: <AppText.Body>{inventory.shoeSize}</AppText.Body>
        </AppText.Subhead>
        <AppText.Subhead style={{marginBottom: 5}}>
          {strings.InventoryQuantity}:{' '}
          <AppText.Body>{inventory.quantity}</AppText.Body>
        </AppText.Subhead>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const AccountTabInventory: React.FC<{}> = () => {
  const inventoryService = getDependency<IInventoryService>(
    FactoryKeys.IInventoryService,
  );
  const [inventories, setInventories] = useState<(Inventory & {shoe: Shoe})[]>(
    [],
  );
  const [searchKey, setSearchKey] = useState<string>('');

  const profile: Profile = useSelector(
    (state: IAppState) => state?.UserState?.profileState?.profile,
  );

  const showInventory = Boolean(profile) && profile?.isSeller;

  const navigation = useNavigation();
  let token;
  useEffect(() => {
    async function getFirebaseToken(){
      token = await getToken(true);
      inventoryService.getInventories(token, searchKey).then((i) => {
        setInventories(i);
      });
    }
    getFirebaseToken();

    const unsubscribe = navigation.addListener('focus', async () => {
      inventoryService.getInventories(await token, searchKey).then((i) => {
        setInventories(i);
      });
    });

    return unsubscribe;
  }, [inventoryService, token, searchKey, navigation]);

  if (showInventory){
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingTop: 0,
          paddingBottom: 0,
        }}>
        <SearchBar
          lightTheme={true}
          round={true}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={themes.TextStyle.body}
          value={searchKey}
          searchIcon={{size: themes.IconSize, name: 'search'}}
          onChangeText={(text: string): void => {
            setSearchKey(text);
          }}
        />
        <FlatList
          style={{flex: 1}}
          data={inventories}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <InventoryItem inventory={item} />}
        />
      </SafeAreaView>
    );
  } else{
    return (
    <SafeAreaView
    style={{
      flex: 1,
      backgroundColor: 'white',
      paddingTop: 0,
      paddingBottom: 0,
    }}>
    <View style={styles.logInButtonContainerStyle}>
        <AppText.Body style={styles.logInTextStyle}>
          Đăng ký bán hàng trên SneakGeek
        </AppText.Body>
        <TouchableOpacity
          style={styles.logInButtonStyle}
          onPress={async () =>  {
            let url = 'https://www.landing.sneakgeek.io/seller';
            const supported = await Linking.canOpenURL(url);
            if (supported) {
              // Opening the link with some app, if the URL scheme is "http" the web link should be opened
              // by some browser in the mobile
              await Linking.openURL(url);
            }
          }}>
          <AppText.Body style={[styles.logInTextStyle, {fontWeight: '700'}]}>
            ĐĂNG KÝ NGAY
          </AppText.Body>
        </TouchableOpacity>
      </View>
  </SafeAreaView>
  );
  }
};
