import React, {useContext, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icon, SearchBar} from 'react-native-elements';
import Strings from '../../Common/Strings';
import ThemeContext from '../../Context/ThemeContext';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  onSearch: (text: string) => void;
  onSubmitEditing: () => void;
  onClear: () => void;
};

const AppSearchBar: React.FC<Props> = ({
  containerStyle,
  onSearch,
  onSubmitEditing,
  onClear,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const onChangeText = (text: string) => {
    setSearchText(text);
    // search
  };
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.searchBarRoot, containerStyle]}>
      <SearchBar
        placeholder={Strings.Search}
        lightTheme={true}
        round={true}
        value={searchText}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        searchIcon={{size: theme.icon.size, name: 'search'}}
        inputStyle={theme.text.body}
        onChangeText={(text) => {
          onSearch(text);
          onChangeText(text);
        }}
        onCancel={() => setSearchText('')}
        onClear={onClear}
        onSubmitEditing={onSubmitEditing}
      />
      <Icon
        name={'tune'}
        size={theme.icon.size}
        color={theme.color.brandColorPrimary}
        onPress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  searchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: 'transparent',
    flex: 1,
  },
});

export default AppSearchBar;
