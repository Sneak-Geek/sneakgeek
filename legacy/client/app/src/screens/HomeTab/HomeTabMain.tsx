import React from 'react';
import {AppText, ImageRatioPreserved} from 'screens/Shared';
import {
  StatusBar,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'utilities';
import {IAppState} from 'store/AppStore';
import {NetworkRequestState, Catalog, getHomeCatalogs, Shoe} from 'business';
import {toggleIndicator} from 'actions';
import {strings, themes} from 'resources';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import RouteNames from 'navigations/RouteNames';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar} from 'react-native-elements';

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: themes.AppBackgroundColor,
  },
  hotShoeContainer: {
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    ...themes.ButtonShadow,
  },
  hotShoeContentContainer: {
    backgroundColor: 'white',
    borderColor: themes.DisabledColor,
    borderWidth: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height * 0.3,
    paddingBottom: 8,
    borderRadius: 20,
  },
  shoeImage: {
    flex: 1,
    width: 250,
    height: 200,
    marginVertical: 5,
  },
  hotShoeTitle: {
    textAlign: 'center',
    maxWidth: '85%',
  },
  sectionTitle: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  brandTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  catalogImage: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: themes.DisabledColor,
    borderBottomColor: themes.DisabledColor,
  },
  rankingRootContainer: {
    width: Dimensions.get('screen').width,
    padding: 20,
  },
  shoeRankingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    flex: 1,
  },
  rankingInnerContainer: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: themes.AppDisabledColor,
    borderRadius: 40,
    ...themes.ButtonShadow,
  },
  hotShoeRegularContainer: {
    width: 165,
    marginRight: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: themes.AppDisabledColor,
    borderRadius: themes.ButtonBorderRadius * 2,
    ...themes.ButtonShadow,
    marginVertical: 5,
  },
});

type Props = {
  homeCatalogState: {
    state: NetworkRequestState;
    error?: any;
    catalogs?: {
      Nike: Catalog;
      Jordan: Catalog;
      adidas: Catalog;
      hot: Catalog;
      ranking: Catalog;
      toppick: Catalog;
      buynow: Catalog;
    };
  };
  navigation: StackNavigationProp<RootStackParams, 'HomeTabMain'>;

  toggleLoadingIndicator: (isLoading: boolean, message: string) => void;
  getHomepageCatalogs(): void;
};

type ShoeCardProps = {
  shoe: Shoe;
  onPress: () => void;
};

@connect(
  (state: IAppState) => ({
    homeCatalogState: state.CatalogState.homepageCatalogState,
  }),
  (dispatch: Function) => ({
    toggleLoadingIndicator: (isLoading: boolean, message: string): void => {
      dispatch(toggleIndicator({isLoading, message}));
    },
    getHomepageCatalogs: (): void => {
      dispatch(getHomeCatalogs());
    },
  }),
)
export class HomeTabMain extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.getHomepageCatalogs();
  }

  public componentDidUpdate(prevProps: Props): void {
    if (this.props.navigation.isFocused()) {
      const prevState = prevProps.homeCatalogState.state;
      const {homeCatalogState, toggleLoadingIndicator} = this.props;

      if (prevState === homeCatalogState.state) {
        return;
      }

      switch (homeCatalogState.state) {
        case NetworkRequestState.NOT_STARTED:
          break;
        case NetworkRequestState.REQUESTING:
          toggleLoadingIndicator(true, strings.PleaseWait);
          break;
        case NetworkRequestState.FAILED:
        case NetworkRequestState.SUCCESS:
        default:
          toggleLoadingIndicator(false, '');
          break;
      }
    }
  }

  public render(): JSX.Element {
    const {homeCatalogState} = this.props;
    const {state} = homeCatalogState;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        {state === NetworkRequestState.SUCCESS && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rootContainer}>
              {this._renderTrendingShoes()}
              {this._renderRanking()}
              {this._renderByBrand('Nike')}
              {this._renderImageCatalog(homeCatalogState.catalogs.toppick)}
              {this._renderByBrand('adidas')}
              {this._renderImageCatalog(homeCatalogState.catalogs.buynow)}
              {this._renderByBrand('Jordan')}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  private _renderImageCatalog(catalog: Catalog): JSX.Element {
    return (
      <View style={styles.catalogImage}>
        <ImageRatioPreserved source={catalog.coverImage} />
      </View>
    );
  }

  private _renderRanking(): JSX.Element {
    const ranking = this.props.homeCatalogState.catalogs.ranking;

    return (
      <View>
        <AppText.Title2 style={styles.sectionTitle}>
          {ranking.title}
        </AppText.Title2>
        <ScrollView horizontal={true} pagingEnabled={true}>
          {this._renderRankingList(ranking.products.slice(0, 5), 1)}
          {this._renderRankingList(ranking.products.slice(6, 11), 6)}
        </ScrollView>
      </View>
    );
  }

  private _renderRankingList(
    products: Shoe[],
    startIndex: number,
  ): JSX.Element {
    return (
      <View style={styles.rankingRootContainer}>
        <View style={styles.rankingInnerContainer}>
          {products.map(
            (shoe, index): JSX.Element => (
              <TouchableWithoutFeedback
                key={shoe._id}
                onPress={(): void => this._navigateToProductDetail(shoe)}>
                <View style={styles.shoeRankingContainer}>
                  <Avatar
                    rounded
                    title={(index + startIndex).toString()}
                    size={'medium'}
                    titleStyle={themes.TextStyle.body}
                    overlayContainerStyle={{
                      backgroundColor: themes.AppPrimaryColor,
                    }}
                  />
                  <Image
                    source={{uri: shoe.imageUrl}}
                    style={{width: 90, aspectRatio: 1, marginHorizontal: 20}}
                    resizeMode={'contain'}
                  />
                  <AppText.Subhead
                    style={{flex: 1, flexWrap: 'wrap'}}
                    numberOfLines={2}>
                    {shoe.title}
                  </AppText.Subhead>
                </View>
              </TouchableWithoutFeedback>
            ),
          )}
        </View>
      </View>
    );
  }

  private _renderTrendingShoes(): JSX.Element {
    const hotCatalog = this.props.homeCatalogState.catalogs.hot;
    return (
      <View style={{marginBottom: 20}}>
        <AppText.Title1 style={styles.sectionTitle}>
          {hotCatalog.title}
        </AppText.Title1>
        <FlatList
          horizontal={true}
          keyExtractor={(itm): string => itm._id}
          data={hotCatalog.products}
          renderItem={({item}): JSX.Element => (
            <HotShoeLarge
              shoe={item}
              onPress={this._navigateToProductDetail.bind(this, item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
        />
      </View>
    );
  }

  private _renderByBrand(brand: 'Nike' | 'adidas' | 'Jordan'): JSX.Element {
    const catalog = this.props.homeCatalogState.catalogs[brand];
    return (
      <View style={{marginVertical: 10}}>
        <View style={styles.brandTitleContainer}>
          <AppText.Title2>{catalog.title}</AppText.Title2>
          <AppText.Footnote
            style={{textDecorationLine: 'underline'}}
            onPress={this._seeMore.bind(this, catalog)}>
            {strings.SeeMore}
          </AppText.Footnote>
        </View>
        <FlatList
          horizontal={true}
          keyExtractor={(itm): string => itm._id}
          data={catalog.products.slice(0, 10)}
          style={{marginVertical: 20, paddingLeft: 20}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}): JSX.Element => (
            <HotShoeRegular
              shoe={item}
              onPress={this._navigateToProductDetail.bind(this, item)}
            />
          )}
        />
      </View>
    );
  }

  private _navigateToProductDetail(shoe: Shoe): void {
    this.props.navigation.push(RouteNames.Product.Name, {
      screen: RouteNames.Product.ProductDetail,
      params: {shoe},
    });
  }

  private _seeMore(catalog: Catalog): void {
    this.props.navigation.push(RouteNames.Tab.HomeTab.SeeMore, {catalog});
  }
}

const HotShoeLarge = ({shoe, onPress}: ShoeCardProps): JSX.Element => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.hotShoeContainer}>
      <View style={styles.hotShoeContentContainer}>
        <Image
          source={{uri: shoe.imageUrl, cache: 'default'}}
          style={styles.shoeImage}
          resizeMode={'contain'}
        />
        <AppText.Title3
          numberOfLines={2}
          style={styles.hotShoeTitle}
          ellipsizeMode={'tail'}>
          {shoe.title}
        </AppText.Title3>
      </View>
    </View>
  </TouchableOpacity>
);

const HotShoeRegular = ({shoe, onPress}: ShoeCardProps): JSX.Element => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.hotShoeRegularContainer}>
      <Image
        source={{uri: shoe.imageUrl}}
        style={{width: 140, height: 120}}
        resizeMode={'contain'}
      />
      <AppText.Subhead
        numberOfLines={2}
        ellipsizeMode={'tail'}
        style={{marginTop: 25, paddingVertical: 8, paddingHorizontal: 12}}>
        {shoe.title}
      </AppText.Subhead>
    </View>
  </TouchableOpacity>
);
