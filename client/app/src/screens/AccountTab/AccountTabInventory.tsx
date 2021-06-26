import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View, TextInput} from 'react-native';
import {getDependency, getToken, toCurrencyString} from 'utilities';
import {IInventoryService, FactoryKeys, Inventory} from 'business';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppText, BottomButton, BottomPicker, ShoeHeaderSummary} from 'screens/Shared';
import {strings, themes} from 'resources';
import {Shoe} from 'business/src';
import {SearchBar} from 'react-native-elements';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import RouteNames from 'navigations/RouteNames';
import {DismissKeyboardView} from 'screens/Shared';
import { SNKGKPickerRow } from './AccountTabEditProfile';
import { useDispatch } from 'react-redux';
import { showSuccessNotification } from 'actions';
import { useCallback } from 'react';

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
});

type PickerState = {
  pickerVisible: boolean;
  pickerValue: string;
}

export const AccountTabInventoryDetail: React.FC<{}> = () => {
  const route = useRoute();
  const inventory: Inventory & {shoe: Shoe} = (route.params as any).inventory;

  const [quantity, setQuantity] = useState<number>(inventory.quantity);
  const [pickerState, setPickerState] = useState<PickerState>({
    pickerVisible: false,
    pickerValue: inventory?.shoeSize
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [price, setPrice] = useState<number>(inventory.sellPrice);
  const navigation = useNavigation();

  const items = [
    {
      title: strings.ShoeSize,
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
      displayText: price.toString(),
      editable: true,
      onUpdate: (text: string) => {
        setPrice(parseInt(text, 10));
      },
    },
  ];

  const shoeSizeOptions = ['1','1.5','2','2.5','3','3.5','4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14','14.5','15','15.5']

  return (
    <DismissKeyboardView
      style={{flex: 1, backgroundColor: 'white', paddingTop: 0}}>
      <ShoeHeaderSummary shoe={inventory.shoe} />
      <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
        {items.map((t) => {
          switch (t.title) {
            case strings.ShoeSize:
              // TO DO (DUC): Combine Picker Row with Picker Modal in AccountTabEditProfile 
              return <SNKGKPickerRow style={{marginBottom: 20}} title={t.title} value={pickerState.pickerValue} onPress={() =>  setPickerState({...pickerState, pickerVisible: true})}/>;
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
                     
                      width: 300,
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
          navigation.goBack()
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
          const token = getToken();
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
          dispatch(showSuccessNotification("Thay đổi đơn hàng thành công!"))
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
  const token = getToken();
  const inventoryService = getDependency<IInventoryService>(
    FactoryKeys.IInventoryService,
  );
  const [inventories, setInventories] = useState<(Inventory & {shoe: Shoe})[]>(
    [],
  );
  const [searchKey, setSearchKey] = useState<string>('');

  // inventoryService.getInventories(token, searchKey).then((i) => {
  //   setInventories(i);
  // });

  
  const navigation = useNavigation();
  useEffect(() => {
    inventoryService.getInventories(token, searchKey).then((i) => {
      setInventories(i);
    });
    
    const unsubscribe = navigation.addListener('focus', () => {
      inventoryService.getInventories(token, searchKey).then((i) => {
        setInventories(i);
      });
    });

    return unsubscribe;
  }, [inventoryService, token, searchKey, navigation]);

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
};
