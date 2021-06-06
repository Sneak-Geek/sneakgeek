import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View, TextInput} from 'react-native';
import {getDependency, getToken, toCurrencyString} from 'utilities';
import {IInventoryService, FactoryKeys, Inventory} from 'business';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppText, BottomButton, ShoeHeaderSummary} from 'screens/Shared';
import {strings, themes} from 'resources';
import {Shoe} from 'business/src';
import {SearchBar} from 'react-native-elements';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import RouteNames from 'navigations/RouteNames';
import {DismissKeyboardView} from 'screens/Shared';

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

export const AccountTabInventoryDetail: React.FC<{}> = () => {
  const route = useRoute();
  const inventory: Inventory & {shoe: Shoe} = (route.params as any).inventory;

  const [quantity, setQuantity] = useState<number>(inventory.quantity);
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
        setQuantity(parseInt(text));
      },
    },
    {
      title: strings.Price,
      displayText: price.toString(),
      editable: true,
      onUpdate: (text: string) => {
        setPrice(parseInt(text));
      },
    },
  ];

  return (
    <DismissKeyboardView
      style={{flex: 1, backgroundColor: 'white', paddingTop: 0}}>
      <ShoeHeaderSummary shoe={inventory.shoe} />
      <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
        {items.map((t) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <AppText.SubHeadline>{t.title}</AppText.SubHeadline>
            <TextInput
              defaultValue={t.displayText}
              numberOfLines={1}
              editable={t.editable}
              style={{
                ...themes.TextStyle.body,
                marginBottom: 20,
                width: 300,
                textAlign: 'right',
              }}
              keyboardType={'number-pad'}
              onChangeText={t.onUpdate}
            />
          </View>
        ))}
      </View>
      <BottomButton
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
            _id: inventory.id,
            sellerId: inventory.sellerId,
            shoeId: inventory.shoeId,
            shoeSize: inventory.shoeSize,
            quantity,
            sellPrice: price,
          };
          await inventoryService.updateInventory(token, updatedInventory);
          navigation.goBack();
        }}
      />
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
        navigation.navigate(RouteNames.Tab.AccountTab.InventoryDetail, {
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

  useEffect(() => {
    inventoryService.getInventories(token, searchKey).then((i) => {
      setInventories(i);
    });
  }, [inventoryService, token, searchKey]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white', paddingTop: 0}}>
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
