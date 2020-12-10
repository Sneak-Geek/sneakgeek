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
import {connect, getDependency, toCurrencyString} from 'utilities';
import {IAppState} from 'store/AppStore';
import {
  NetworkRequestState,
  Catalog,
  getHomeCatalogs,
  Shoe,
  SellingInventory,
  FactoryKeys,
  IInventoryService,
} from 'business';
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

type CurrentInventoryProps = {
  currentInventory: SellingInventory;
  onPress: () => void;
};

type State = {
  selling: SellingInventory[];
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
export class HomeTabMain extends React.Component<Props, State> {
  state = {
    selling: new Array<SellingInventory>(),
  };

  public componentDidMount(): void {
    const inventoryService: IInventoryService = getDependency(
      FactoryKeys.IInventoryService,
    );
    inventoryService
      .getSelling()
      .then((inventories) => this.setState({selling: inventories}));
    this.props.getHomepageCatalogs();
  }

  public componentDidUpdate(prevProps: Props) {
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
              {this._renderCurrentSelling()}
              {this._renderTopTrending()}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  private _renderTopTrending(): JSX.Element {
    const ranking = this.props.homeCatalogState.catalogs.ranking;

    return (
      <View>
        <AppText.Title2 style={styles.sectionTitle}>
          {strings.TopTrending}
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
                    source={{uri: shoe.media.imageUrl}}
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

  private _renderCurrentSelling(): JSX.Element {
    const catalog = this.props.homeCatalogState.catalogs.Nike;
    return (
      <View style={{marginVertical: 10}}>
        <View style={styles.brandTitleContainer}>
          <AppText.Title2>{strings.Selling}</AppText.Title2>
          <AppText.Footnote
            style={{textDecorationLine: 'underline'}}
            onPress={this._seeMore.bind(this, catalog)}>
            {strings.SeeMore}
          </AppText.Footnote>
        </View>
        <FlatList
          horizontal={true}
          keyExtractor={(itm): string => itm._id}
          data={this.state.selling}
          style={{marginVertical: 20, paddingLeft: 20}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}): JSX.Element => (
            <CurrentInventory
              currentInventory={item}
              onPress={this._navigateToProductDetail.bind(this, item.shoe)}
            />
          )}
        />
      </View>
    );
  }

  private _navigateToProductDetail(shoe: Shoe): void {
    this.props.navigation.navigate(RouteNames.Product.Name, {shoe});
  }

  private _seeMore(catalog: Catalog): void {
    this.props.navigation.push('CatalogSeeMore', {catalog});
  }
}

const CurrentInventory = ({
  currentInventory,
  onPress,
}: CurrentInventoryProps): JSX.Element => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.hotShoeRegularContainer}>
      <Image
        source={{uri: currentInventory.shoe.media.imageUrl}}
        style={{width: 140, height: 120}}
        resizeMode={'contain'}
      />
      <View style={{marginTop: 25, marginHorizontal: 8, marginBottom: 10}}>
        <AppText.Subhead numberOfLines={2} ellipsizeMode={'tail'}>
          {currentInventory.shoe.title}
        </AppText.Subhead>
        <AppText.Callout style={{marginTop: 10}}>
          {toCurrencyString(currentInventory.sellPrice)}
        </AppText.Callout>
      </View>
    </View>
  </TouchableOpacity>
);
