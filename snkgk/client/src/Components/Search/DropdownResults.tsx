import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import ThemeContext from '../../Context/ThemeContext';
import {Shoes} from '../../Model/Shoes';
import RouteNames from '../../Navigation/RouteNames';

const DropdownResults: React.FC<{result: Shoes[]}> = (props) => {
  const navigation = useNavigation();
  const showShoesDetail = (shoes: Shoes) => {
    navigation.navigate(RouteNames.ShoesDetail, {
      shoes: shoes,
    });
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <View style={[StyleSheet.absoluteFillObject, styles.mainContainer]}>
          <FlatList
            style={styles.list}
            data={props.result}
            keyExtractor={(s) => s.stockxId}
            renderItem={({item}) => (
              <ListItem onPress={() => showShoesDetail(item)}>
                <Image
                  source={{uri: item.media.thumbUrl}}
                  style={theme.image.thumbnail}
                  resizeMode={'contain'}
                />
                <ListItem.Content>
                  <ListItem.Title style={theme.text.subhead}>
                    {item.title}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
          />
        </View>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    zIndex: 1,
    flex: 1,
  },
  list: {
    flex: 1,
  },
});

export default DropdownResults;
