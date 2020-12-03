import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RouteNames from '../../Navigation/RouteNames';
import {search} from '../../Services/SearchService';
import AppSearchBar from './SearchBar';

const FullSearchResults = () => {
  return <View style={[{flex: 1}]} />;
};

const DropdownSearchResults = () => {
  return <></>;
};

const FilterModal = () => <></>;

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.innerContainer}>
        <AppSearchBar
          containerStyle={styles.searchBar}
          onSearch={(text) => {
            setIsSearching(true);
            search(0, text);
          }}
        />
        <View style={{flex: 1, top: 65}}>
          {isSearching ? <FullSearchResults /> : <DropdownSearchResults />}
        </View>
        <FilterModal />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
  },
  searchBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default SearchScreen;
