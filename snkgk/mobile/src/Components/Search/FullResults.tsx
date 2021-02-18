import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Shoes} from '../../Model/Shoes';
import RouteNames from '../../Navigation/RouteNames';
import {AppText} from '../Shared/AppText';

const FullResults: React.FC<{
  result: Shoes[];
  onScrollEnd: () => void;
}> = (props) => {
  const navigation = useNavigation();

  const showShoesDetail = (shoes: Shoes) => {
    navigation.navigate(RouteNames.ShoesDetail, {
      shoes: shoes,
    });
  };

  return (
    <FlatList
      style={styles.listContainer}
      data={props.result}
      keyExtractor={(item) => item.stockxId}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.resultContainer}
          activeOpacity={0.6}
          onPress={() => showShoesDetail(item)}>
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
    flex: 1,
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

export default FullResults;
