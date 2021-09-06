import React from 'react';
import {AppText, ColumnShoeCard, LiteShoeCard} from 'screens/Shared';
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
  RefreshControl,
} from 'react-native';
import {connect, getDependency, toCurrencyString} from 'utilities';
import {
  getHomeCatalogs,
  Shoe,
  SellingInventory,
  FactoryKeys,
  IInventoryService,
  TrendingOrder,
  IOrderService,
} from 'business';
import {toggleIndicator} from 'actions';
import {strings, themes} from 'resources';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import RouteNames from 'navigations/RouteNames';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar} from 'react-native-elements';
import {IAppState} from 'store/AppStore';
import {Catalog} from 'business/src';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  hotShoeContainer: {
    width: width,
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
    height: height * 0.3,
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
  trendingImgStyle: {
    width: null,
    resizeMode: 'contain',
    height: 440,
  },
});

type Props = {
  topTrending: Catalog;
  top20: Catalog;
  navigation: StackNavigationProp<RootStackParams, 'HomeTabMain'>;

  toggleLoadingIndicator: (isLoading: boolean, message: string) => void;
  getHomepageCatalogs(): void;
};

type CurrentInventoryProps = {
  currentInventory: SellingInventory;
  onPress: () => void;
};

type State = {
  isGettingData: boolean;
  shoes: Shoe[];
  selling: SellingInventory[];
  trendingOrders: TrendingOrder[];
  inventoryPageNum: Number;
};

@connect(
  (state: IAppState) => ({
    topTrending: state.CatalogState.homepageCatalogState?.catalogs?.hot,
    top20: state.CatalogState.homepageCatalogState?.catalogs?.['top20'],
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
    isGettingData: false,
    shoes:  new Array<Shoe>(),
    selling: new Array<SellingInventory>(),
    trendingOrders: new Array<TrendingOrder>(),
    inventoryPageNum: 0,
  };

  _unsubscribe = undefined;
  onEndReachedCalledDuringMomentum = true;

  public async componentDidMount(): Promise<void> {
    await this.props.getHomepageCatalogs();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this._getData();
    });
  }

  public componentWillUnmount() {
    this._unsubscribe();
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}} testID={'home'}>
        <StatusBar barStyle={'dark-content'} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: themes.AppBackgroundColor}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isGettingData}
              onRefresh={this._getData.bind(this)}
            />
          }>
          <View style={styles.rootContainer}>
            {this._renderCurrentSelling()}
            {this._renderTop20()}
            {this._renderTopTrending()}
            {this._renderSearchResults()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  private _goToProduct(shoe: Shoe): void {
    this.props.navigation.navigate(RouteNames.Product.Name, {
      shoe,
    });
  }

  private _renderSearchResults(): JSX.Element {
    return (
      <View style={{display: 'flex', width, marginVertical: 20}}>
        <AppText.Title2 style={styles.sectionTitle}>
          Đang Hot 🔥
        </AppText.Title2>
        <FlatList
          data={this.state.shoes}
          keyExtractor={(item: Shoe, index: number): string =>
            `${index}${item._id}`
          }
          renderItem={({item}): JSX.Element => (
            <ColumnShoeCard
              shoe={item}
              onPress={(): void => this._goToProduct(item)}
            />
          )}
          showsVerticalScrollIndicator={true}
          columnWrapperStyle={{flex: 1, justifyContent: 'space-around'}}
          numColumns={2}
          onEndReachedThreshold={0.2}
          onEndReached= {({ distanceFromEnd }) => {
            console.log("Search List Reaching End");
            if(!this.onEndReachedCalledDuringMomentum){
                this.state.inventoryPageNum += 1;
                this._getData();
                this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          style={{marginHorizontal: 5}}
        />
      </View>
    );
  }

  private _union = (arr1, arr2, key) => [... // spread to an array
    arr1.concat(arr2) // concat the arrays
    .reduce((m, o) => m.has(o[key]) ? m : m.set(o[key], o), new Map) // reduce to a map by value of key
    .values()]; // get the values iterator

  private _getData() {
    this.setState({isGettingData: true});
    const inventoryService: IInventoryService = getDependency(
      FactoryKeys.IInventoryService,
    );
    const orderService: IOrderService = getDependency(
      FactoryKeys.IOrderService,
    );

    Promise.all([
      inventoryService.getSelling(this.state.inventoryPageNum),
      orderService.getTrendingOrder(10),
    ]).then(([inventories, orders]) => {
      this.state.selling = this.state.selling.filter(val => inventories.filter((item)=>{return item.shoe.name === val.shoe.name;}).length === 0)
      let updatedInventories = this.state.selling.concat(inventories);

      this.setState({
        shoes: updatedInventories.map(inventory => {
          return {
            ...inventory.shoe,
            sellPrice: inventory.sellPrice
          }
        }),
        selling: updatedInventories,
        trendingOrders: orders,
        isGettingData: false,
      });
    });
  }

  private _renderTopTrending(): JSX.Element {
    const {topTrending} = this.props;
    return (
      <View style={{display: 'flex', width}}>
        <AppText.Title2 style={styles.sectionTitle}>
          {strings.TopTrending}
        </AppText.Title2>
        {this._renderRankingList(topTrending)}
      </View>
    );
  }

  private _renderRankingList(topTrending: Catalog): JSX.Element {
    if (!topTrending) {
      return <></>;
    }
    const shoes = topTrending?.products.slice(1, 6);
    return (
      <View style={styles.rankingRootContainer}>
        <View style={styles.rankingInnerContainer}>
          {shoes.map(
            (shoe, index): JSX.Element => (
              <TouchableWithoutFeedback
                key={shoe._id}
                onPress={(): void => this._navigateToProductDetail(shoe)}>
                <View style={styles.shoeRankingContainer}>
                  <Avatar
                    rounded
                    title={(index + 1).toString()}
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
    return (
      <View style={{marginVertical: 20}}>
        <View style={styles.brandTitleContainer}>
          <AppText.Title2>{strings.Selling}</AppText.Title2>
          {this.state.selling.length >= 4 && (
            <AppText.Footnote
              style={{textDecorationLine: 'underline'}}
              onPress={() => {
                this.props.navigation.push(RouteNames.Tab.HomeTab.SeeMore, {
                  inventories: this.state.selling,
                });
              }}>
              {strings.SeeMore}
            </AppText.Footnote>
          )}
        </View>
        {this.state.selling.length > 0 ? (
          <FlatList
            testID={'InventoryList'}
            horizontal={true}
            keyExtractor={(itm): string => itm.shoe._id}
            data={this.state.selling}
            style={{marginVertical: 20, paddingLeft: 20, marginRight: 15}}
            onEndReachedThreshold={0.9}
            onEndReached= {({ distanceFromEnd }) => {
              if(!this.onEndReachedCalledDuringMomentum){
                  this.state.inventoryPageNum += 1;
                  this._getData();
                  this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}): JSX.Element => (
              <CurrentInventory
                currentInventory={item}
                onPress={this._navigateToProductDetail.bind(this, item.shoe)}
              />
            )}
          />
        ) : (
          <></>
        )}
      </View>
    );
  }

  private _renderTop20(): JSX.Element {
    return (
      <View style={{marginVertical: 20}}>
        <View style={styles.brandTitleContainer}>
          <AppText.Title2>{strings.Top20}</AppText.Title2>
        </View>
        {this.props.topTrending?.products?.length > 0 ? (
          <FlatList
            testID={'InventoryList'}
            horizontal={true}
            keyExtractor={(itm): string => itm._id}
            data={this.props.top20.products}
            style={{marginVertical: 20, paddingLeft: 20, marginRight: 15}}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}): JSX.Element => (
              <LiteShoeCard
                style={{ marginRight: 8 }}
                price={0}
                shoe={item}
                onPress={this._navigateToProductDetail.bind(this, item)}
              />
            )}
          />
        ) : (
          <></>
        )}
      </View>
    );
  }

  private _navigateToProductDetail(shoe: Shoe): void {
    this.props.navigation.navigate(RouteNames.Product.Name, {shoe});
  }
}

const CurrentInventory = ({
  currentInventory,
  onPress,
}: CurrentInventoryProps): JSX.Element => (
  <TouchableOpacity testID={'inventory'} onPress={onPress}>
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
