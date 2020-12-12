import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {getDependency, getToken, toCurrencyString} from 'utilities';
import {IInventoryService, FactoryKeys, Inventory} from 'business';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppText} from 'screens/Shared';
import {strings, themes} from 'resources';
import {Shoe} from 'business/src';
import {SearchBar} from 'react-native-elements';

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

const InventoryItem: React.FC<{inventory: Inventory & {shoe: Shoe}}> = (props) => {
  const inventory = props.inventory;
  const shoe = inventory.shoe;
  return (
    <View style={styles.inventoryContainer}>
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
    </View>
  );
};

export const AccountTabInventory: React.FC<{}> = () => {
  const token = getToken();
  const inventoryService = getDependency<IInventoryService>(
    FactoryKeys.IInventoryService,
  );
  const [inventories, setInventories] = useState<(Inventory & {shoe: Shoe})[]>([]);
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
        onChangeText={(text: string): void => { setSearchKey(text) }}
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
