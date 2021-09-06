import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from 'navigations/RootStack';
import { RouteProp } from '@react-navigation/native';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  ,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { AppText, LiteShoeCard } from 'screens/Shared';
import { strings, themes } from 'resources';
import {
  connect,
  toVnDateFormat,
  toCurrencyString,
  convertUsdToVnd,
  getDependency,
  translateGenderToVnms,
} from 'utilities';
import { IAppState } from 'store/AppStore';
import {
  Profile,
  getShoeInfo,
  NetworkRequestState,
  Shoe,
  getCurrentUser,
  OrderService,
} from 'business';
import RouteNames from 'navigations/RouteNames';
import { FactoryKeys, InventoryService } from 'business/src';
import analytics from '@react-native-firebase/analytics';
import ZoomableImage from 'react-native-image-zoom-viewer';
import { LineChart } from 'react-native-chart-kit';

type Props = {
  profile: Profile;
  route: RouteProp<RootStackParams, 'ProductDetail'>;
  navigation: StackNavigationProp<RootStackParams, 'ProductDetail'>;
  shoeInfoState: {
    state: NetworkRequestState;
    error?: any;
    relatedShoes: Shoe[];
  };
  getReviews: (shoeId: string) => void;
  getShoeInfo: (shoeId: string) => void;
  getCurrentUser: () => void;
};

type PriceHistoryPoint = { price: number, soldOn: Date };

type State = {
  lowestPrice: number;
  imageClicked: boolean;
  priceHistory: Array<PriceHistoryPoint>;
  chartPointClicked?: { index: number, value: PriceHistoryPoint, x: number, y: number };
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'white',
    flex: 1,
    position: 'relative',
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  shoeImageContainer: {
    height: Dimensions.get('window').height * 0.3,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  backHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  shoeTitle: {
    marginTop: 24,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  shoeDescription: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 30,
    marginHorizontal: 40,
    lineHeight: themes.TextStyle.body.fontSize * 1.4,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailKey: {
    minWidth: '25%',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  noReview: {
    textAlign: 'left',
    marginVertical: 10,
  },
  ratingHeaderContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '3%',
  },
  bottomButtonStyle: {
    height: themes.RegularButtonHeight,
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    borderRadius: themes.LargeBorderRadius,
    flexDirection: 'row',
  },
  addReview: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

@connect(
  (state: IAppState) => ({
    shoeInfoState: state.ProductState.infoState,
    profile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    getShoeInfo: (shoeId: string): void => dispatch(getShoeInfo(shoeId)),
    getCurrentUser: () => dispatch(getCurrentUser()),
  }),
)
export class ProductDetail extends React.Component<Props, State> {
  private _shoe = this.props.route.params.shoe;
  private inventoryService: InventoryService = getDependency(
    FactoryKeys.IInventoryService,
  );
  private orderService: OrderService = getDependency(FactoryKeys.IOrderService);

  state = {
    lowestPrice: 0,
    imageClicked: false,
    priceHistory: [],
    chartPointClicked: null
  };

  public componentDidMount(): void {
    if (this._shoe) {
      analytics().logViewItem({
        items: [{
          item_name: this._shoe.title,
          item_brand: this._shoe.brand,
          item_id: this._shoe._id
        }],
      });
    }
    this._getShoeData();
    this._getLowestPrice();
    this._getPriceHistory();
    this._getCurrentUser();
  }

  private _getShoeData() {
    this.props.getShoeInfo(this._shoe._id);
  }

  private _getCurrentUser() {
    this.props.getCurrentUser();
  }

  private async _getLowestPrice() {
    const lowestPrice = await this.inventoryService.getLowestSellPrice(
      this._shoe._id,
    );
    this.setState({ lowestPrice });
  }

  private async _getPriceHistory() {
    const priceHistory = await this.orderService.getShoeOrderHistory(this._shoe._id, 5);
    this.setState({ priceHistory });
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View
            testID={'ProductDetail'}
            style={{
              ...styles.rootContainer,
            }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <TouchableWithoutFeedback onPress={() => this.setState({ chartPointClicked: null })}>
                <View
                  style={{
                    ...styles.pageContainer,
                    marginBottom: insets.bottom + themes.RegularButtonHeight,
                  }}>
                  {this._renderProductImage()}
                  {this._renderProductTitle()}
                  {this._renderProductDescription()}
                  {this._renderProductDetail()}
                  {this._renderPriceChart()}
                  {this._renderRelatedShoes()}
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
            {this._renderActionButtons(insets.bottom)}
            {this._renderProductImageViewer()}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderPriceChart(): JSX.Element {
    if (this.state.priceHistory.length === 0) {
      return <></>;
    }
    const unprocessedData = this.state.priceHistory
      .sort((a, b) => new Date(a.soldOn).getTime() - new Date(b.soldOn).getTime())
      .map(p => p.price);
    const lowestPrice = this.state
      .priceHistory.sort((a, b) => a.price - b.price)[0]
      .price;

    const labels = [];
    const datasets = [{
      data: [lowestPrice - 100000, ...unprocessedData]
    }];
    return (
      <View>
        <AppText.Title2 style={{ marginHorizontal: 20, marginVertical: 30 }}>
          {strings.PriceHistory.toUpperCase()}
        </AppText.Title2>
        <LineChart data={{ labels, datasets }}
          width={Dimensions.get('screen').width}
          height={200}
          chartConfig={{
            backgroundColor: "white",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            color: () => themes.AppPricePickColor,
            labelColor: () => 'black',
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "3",
              strokeWidth: "0.5",
              stroke: "transparent"
            },
            propsForBackgroundLines: {
              strokeWidth: 0
            },
            propsForLabels: themes.TextStyle.footnote
          }}
          formatYLabel={(label) => `${(parseInt(label, 10) / 1000000).toFixed(2)}M`}
          yAxisInterval={100000}
          hidePointsAtIndex={[0]}
          segments={3}
          onDataPointClick={data => {
            const soldOn = this.state.priceHistory[data.index - 1].soldOn;
            this.setState({
              chartPointClicked: {
                index: data.index,
                value: {
                  price: data.value,
                  soldOn,
                },
                x: data.x,
                y: data.y
              }
            })
          }}
          decorator={() => {
            const tooltipPos = this.state.chartPointClicked;
            if (!tooltipPos) return <></>;
            const position = tooltipPos.x > Dimensions.get('screen').width - 100
              ? { right: Dimensions.get('screen').width - tooltipPos.x }
              : { left: tooltipPos.x };
            return (
              <View style={{
                position: 'absolute',
                top: tooltipPos.y,
                ...position,
                backgroundColor: 'white',
                borderWidth: 1,
                borderRadius: 4,
                borderColor: 'black',
                padding: 12,
                alignItems: 'center',
              }}>
                <AppText.Body>
                  {toCurrencyString(tooltipPos.value.price)}
                </AppText.Body>
                <AppText.Footnote>
                  {toVnDateFormat(tooltipPos.value.soldOn)}
                </AppText.Footnote>
              </View>
            )
          }} />
      </View>
    );
  }

  private _renderProductImage(): JSX.Element {
    return (
      <View style={styles.shoeImageContainer}
        onTouchStart={() => this.setState({ imageClicked: true })}>
        <Image
          source={{ uri: this._shoe.media.imageUrl }}
          style={{ width: '100%', aspectRatio: 2 }}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  private _renderProductImageViewer(): JSX.Element {
    return (
      <Modal visible={this.state.imageClicked}
        transparent
        onRequestClose={this._toggleImageViewer.bind(this)}
        animationType='fade'>
        <ZoomableImage imageUrls={[{ url: this._shoe.media.thumbUrl }]}
          onCancel={this._toggleImageViewer.bind(this)}
          enableSwipeDown />
      </Modal>
    )
  }

  private _toggleImageViewer() {
    this.setState({ imageClicked: !this.state.imageClicked });
  }

  private _renderProductTitle(): JSX.Element {
    return (
      <AppText.Title2 style={styles.shoeTitle} numberOfLines={3} testID={'ProductTitle'}>
        {this._shoe.title}
      </AppText.Title2>
    );
  }

  private _renderProductDescription(): JSX.Element {
    if (!this._shoe.description) {
      return null;
    }

    return (
      <AppText.Body style={styles.shoeDescription}>
        {this._shoe.description}
      </AppText.Body>
    );
  }

  private _renderProductDetail(): JSX.Element {
    const fieldMapping = new Map<string, string>([
      [this._shoe.brand, strings.Brand],
      [translateGenderToVnms(this._shoe.gender), strings.Gender],
      [
        this._shoe.retailPrice
          ? toCurrencyString(convertUsdToVnd(this._shoe.retailPrice))
          : '-',
        strings.RetailPrice,
      ],
      [toVnDateFormat(this._shoe.releaseDate), strings.ReleaseDate],
    ]);
    const views: JSX.Element[] = [];
    fieldMapping.forEach((value: string, key: string) =>
      views.push(
        <View key={key} style={styles.detailRow}>
          <AppText.SubHeadline style={styles.detailKey}>
            {value.toUpperCase()}
          </AppText.SubHeadline>
          <AppText.Body style={styles.detailValue} numberOfLines={2}>
            {key}
          </AppText.Body>
        </View>,
      ),
    );
    return <View style={{ paddingHorizontal: 20 }}>{views}</View>;
  }

  private _renderRelatedShoes(): JSX.Element {
    const { shoeInfoState } = this.props;
    let content: JSX.Element = (
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20, paddingBottom: 10 }}
        data={shoeInfoState.relatedShoes}
        keyExtractor={(itm): string => itm._id}
        renderItem={({ item }): JSX.Element => (
          <LiteShoeCard
            shoe={item}
            onPress={(): void =>
              // @ts-ignore
              this.props.navigation.push(RouteNames.Product.Name, {
                shoe: item,
              })
            }
            style={{ marginRight: 20, paddingBottom: 8 }}
          />
        )}
      />
    );

    return (
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={styles.ratingHeaderContainer}>
          <AppText.Headline>
            {strings.RelatedProducts.toUpperCase()}
          </AppText.Headline>
        </View>
        {content}
      </View>
    );
  }

  private _renderActionButtons(bottom: number): JSX.Element {
    const { profile } = this.props;
    const isSell = profile && profile.isSeller;
    if (!profile) {
      return (<View style={{ bottom, ...styles.bottomContainer }}>
        {
          this._renderSingleActionButton('Mua', () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.NewBuyOrder,
              params: {
                shoe: this._shoe,
              },
            });
          })}
      </View>
      )
    }

    return (
      <View style={{ bottom, ...styles.bottomContainer }}>
        {!isSell ?
          this._renderSingleActionButton('Mua', () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.NewBuyOrder,
              params: {
                shoe: this._shoe,
              },
            });
          }) : this._renderSingleActionButton('Bán', () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.NewSellOrder,
              params: {
                shoe: this._shoe,
              },
            });
          })}
      </View>
    );
  }

  private _renderSingleActionButton(
    actionType: string,
    onPress: () => void,
  ): JSX.Element {
    const { profile } = this.props;

    let backgroundColor: string;
    switch (actionType) {
      case 'Mua':
        backgroundColor = themes.AppPrimaryColor;
        if (this.state.lowestPrice === 0) {
          backgroundColor = themes.AppDisabledColor;
          actionType = strings.OutOfStock;
        }
        break;
      default:
        backgroundColor = themes.AppSellColor;
    }

    const shouldRenderPrice =
      !profile?.isSeller && this.state.lowestPrice !== 0;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!profile?.isSeller && this.state.lowestPrice === 0}
        testID={'ProductActionButton'}>
        <View
          style={{
            backgroundColor,
            ...styles.bottomButtonStyle,
            ...themes.ButtonShadow,
          }}>
          <View style={{ flex: 1, alignItems: 'center', marginVertical: 15 }}>
            <AppText.Title3 style={{ color: themes.AppAccentColor }}>
              {actionType.toUpperCase()}
            </AppText.Title3>
            {shouldRenderPrice && (
              <AppText.SubCallout
                style={{ color: themes.AppAccentColor, alignSelf: 'center' }}>
                {strings.Price}: {toCurrencyString(this.state.lowestPrice)}
              </AppText.SubCallout>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
