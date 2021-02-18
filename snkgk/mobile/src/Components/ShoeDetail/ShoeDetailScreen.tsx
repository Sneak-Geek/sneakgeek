import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Strings from '../../Common/Strings';
import ThemeContext from '../../Context/ThemeContext';
import {Shoes} from '../../Model/Shoes';
import {RootStackParams} from '../../Navigation/RootStack';
import {AppText} from '../Shared/AppText';
import {BottomButton} from '../Shared/BottomButton';

type Props = {
  visible: boolean;
  shoes?: Shoes;
};

const ShoeDetailScreen: React.FC<Props> = () => {
  const shoes = useRoute<RouteProp<RootStackParams, 'ShoeDetail'>>().params
    .shoes;

  const selectors: Array<{value: string; displayName: string}> = [
    {
      value: shoes.brand,
      displayName: Strings.Brand,
    },
    {
      value: shoes.gender,
      displayName: Strings.Gender,
    },
    {
      value: `$${shoes.retailPrice}`,
      displayName: Strings.RetailPrice,
    },
    {
      value: Intl.DateTimeFormat('vi').format(new Date(shoes.releaseDate)),
      displayName: Strings.ReleaseDate,
    },
    {
      value: shoes.colorway?.join(',') ?? '',
      displayName: Strings.Colorway,
    },
  ];

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <SafeAreaView style={styles.rootContainer}>
          <View style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.innerContainer}>
                <Image
                  source={{uri: shoes?.media.imageUrl}}
                  style={styles.shoesImage}
                  resizeMode={'cover'}
                />
                <AppText.Title2
                  numberOfLines={2}
                  style={styles.shoesTitle}
                  textBreakStrategy={'highQuality'}
                  lineBreakMode={'tail'}
                  ellipsizeMode={'tail'}>
                  {shoes?.title}
                </AppText.Title2>
                <AppText.Body>{shoes.description}</AppText.Body>
                <View style={styles.details}>
                  {selectors.map((s) => (
                    <View style={styles.detailContainer}>
                      <AppText.SubHeadline style={styles.detailText}>
                        {s.displayName.toUpperCase()}
                      </AppText.SubHeadline>
                      <AppText.Subhead style={styles.detailText}>
                        {s.value}
                      </AppText.Subhead>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            <BottomButton
              title={'Mua'}
              onPress={() => {}}
              style={{backgroundColor: theme.color.brandColorPrimary}}
            />
          </View>
        </SafeAreaView>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  shoesImage: {
    width: '100%',
    aspectRatio: 1.5,
  },
  shoesTitle: {
    textAlign: 'center',
    marginVertical: 20,
  },
  details: {
    flex: 1,
    alignSelf: 'stretch',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailText: {
    textAlign: 'left',
  },
});

export default ShoeDetailScreen;
