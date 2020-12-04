import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shoes} from '../../Model/Shoes';
import {search} from '../../Services/SearchService';
import DropdownSearchResults from './DropdownSearchResults';
import FullSearchResults from './FullSearchResults';
import AppSearchBar from './SearchBar';

const FilterModal = () => <></>;

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mainResult, setMainResult] = useState<Shoes[]>([]);
  const [dropDownResult, setDropdownResult] = useState<Shoes[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const onSearch = (text: string) => {
    setSearchText(text);
    setIsSearching(true);
    if (text.length < 2) {
      return;
    }
    search(currentPage, text).then((s) => {
      setDropdownResult(s);
    });
  };

  const onScrollEnd = () => {
    const newPage = currentPage + 1;
    search(newPage, searchText)
      .then((s) => {
        setMainResult([...mainResult, ...s]);
        setCurrentPage(newPage);
      })
      .catch(() => {});
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.innerContainer}>
        <AppSearchBar
          containerStyle={styles.searchBar}
          onSearch={onSearch}
          onSubmitEditing={() => {
            setIsSearching(false);
            setMainResult(dropDownResult);
          }}
          onClear={() => {
            setIsSearching(false);
          }}
        />
        <View style={styles.searchResultContainer}>
          {isSearching && <FullSearchResults result={dropDownResult} />}
          {!isSearching && (
            <DropdownSearchResults
              result={mainResult}
              onScrollEnd={onScrollEnd}
            />
          )}
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
  searchResultContainer: {
    flex: 1,
    top: 65,
    position: 'relative',
  },
});

export default SearchScreen;
