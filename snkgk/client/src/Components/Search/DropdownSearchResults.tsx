import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Shoes} from '../../Model/Shoes';
import RouteNames from '../../Navigation/RouteNames';
import {AppText} from '../Shared/AppText';

const DropdownSearchResults: React.FC<{
  result: Shoes[];
  onScrollEnd: () => void;
}> = (props) => {
  const navigation = useNavigation();
  return (
    <FlatList
      style={styles.listContainer}
      data={props.result}
      keyExtractor={(item) => item.stockxId}
      renderItem={({item}) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(RouteNames.ShoeDetail)}>
          <View style={styles.resultContainer}>
            <Image
              source={{uri: item.media.smallImageUrl}}
              style={styles.image}
              resizeMode={'cover'}
            />
            <AppText.Subhead
              numberOfLines={2}
              lineBreakMode={'tail'}
              ellipsizeMode={'tail'}
              style={styles.shoeTitle}>
              {item.title}
            </AppText.Subhead>
          </View>
        </TouchableOpacity>
      )}
      onEndReached={props.onScrollEnd}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginHorizontal: 8,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: 15,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1.5,
    alignSelf: 'flex-end',
  },
  shoeTitle: {
    flexWrap: 'wrap',
    flexShrink: 1,
    textAlign: 'left',
  },
  columnWrapper: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

export default DropdownSearchResults;
