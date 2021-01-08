import React from 'react';
import {AppText} from 'screens/Shared';
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

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
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
  selling: SellingInventory[];
  trendingOrders: TrendingOrder[];
};

@connect(null, (dispatch: Function) => ({
  toggleLoadingIndicator: (isLoading: boolean, message: string): void => {
    dispatch(toggleIndicator({isLoading, message}));
  },
  getHomepageCatalogs: (): void => {
    dispatch(getHomeCatalogs());
  },
}))
export class HomeTabMain extends React.Component<Props, State> {
  state = {
    isGettingData: false,
    selling: new Array<SellingInventory>(),
    trendingOrders: new Array<TrendingOrder>(),
  };

  public componentDidMount(): void {
    this._getData();
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
            {this._renderTopTrending()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  private _getData() {
    this.setState({isGettingData: true});
    const inventoryService: IInventoryService = getDependency(
      FactoryKeys.IInventoryService,
    );
    const orderService: IOrderService = getDependency(
      FactoryKeys.IOrderService,
    );

    Promise.all([
      inventoryService.getSelling(),
      orderService.getTrendingOrder(10),
    ]).then(([inventories, orders]) => {
      this.setState({
        selling: inventories,
        trendingOrders: orders,
        isGettingData: false,
      });
    });
  }

  private _renderTopTrending(): JSX.Element {
    const {trendingOrders} = this.state;
    return (
      <View>
        <AppText.Title2 style={styles.sectionTitle}>
          {strings.TopTrending}
        </AppText.Title2>
        <ScrollView horizontal={true} pagingEnabled={true}>
          {this._renderRankingList(trendingOrders.slice(0, 5), 1)}
          {trendingOrders.length > 5 &&
            this._renderRankingList(trendingOrders.slice(6, 11), 6)}
        </ScrollView>
      </View>
    );
  }

  private _renderRankingList(
    orders: TrendingOrder[],
    startIndex: number,
  ): JSX.Element {
    return (
      <View style={styles.rankingRootContainer}>
        <View style={styles.rankingInnerContainer}>
          {orders.map(
            (order, index): JSX.Element => (
              <TouchableWithoutFeedback
                key={order.shoe._id}
                onPress={(): void => this._navigateToProductDetail(order.shoe)}>
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
                    source={{uri: order.shoe.media.imageUrl}}
                    style={{width: 90, aspectRatio: 1, marginHorizontal: 20}}
                    resizeMode={'contain'}
                  />
                  <AppText.Subhead
                    style={{flex: 1, flexWrap: 'wrap'}}
                    numberOfLines={2}>
                    {order.shoe.title}
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
      <View style={{marginVertical: 10}}>
        <View style={styles.brandTitleContainer}>
          <AppText.Title2>{strings.Selling}</AppText.Title2>
          <AppText.Footnote
            style={{textDecorationLine: 'underline'}}
            onPress={() => {
              this.props.navigation.push(RouteNames.Tab.HomeTab.SeeMore, {
                inventories: this.state.selling,
              });
            }}>
            {strings.SeeMore}
          </AppText.Footnote>
        </View>
        <FlatList
          horizontal={true}
          keyExtractor={(itm): string => itm.shoe._id}
          data={this.state.selling}
          style={{marginVertical: 20, paddingLeft: 20, marginRight: 15}}
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
