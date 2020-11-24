import React from 'react';
import {
  StackNavigationProp,
  HeaderHeightContext,
} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import {RouteProp} from '@react-navigation/native';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {AppText, LiteShoeCard, ReviewItem} from 'screens/Shared';
import {strings, themes} from 'resources';
import {Icon} from 'react-native-elements';
import {
  connect,
  toVnDateFormat,
  toCurrencyString,
  convertUsdToVnd,
} from 'utilities';
import Humanize from 'humanize-plus';
import {IAppState} from 'store/AppStore';
import {
  Account,
  NetworkRequestState,
  Review,
  getReviews,
  Profile,
  getShoeInfo,
  Shoe,
  SellOrder,
  BuyOrder,
} from 'business';
import RouteNames from 'navigations/RouteNames';

type Props = {
  account: Account;
  profile: Profile;
  route: RouteProp<RootStackParams, 'ProductDetail'>;
  navigation: StackNavigationProp<RootStackParams, 'ProductDetail'>;
  reviewState: {
    state: NetworkRequestState;
    reviews: Review[];
    error?: any;
  };
  shoeInfoState: {
    state: NetworkRequestState;
    error?: any;
    relatedShoes: Shoe[];
    lowestSellOrder?: SellOrder;
    highestBuyOrder?: BuyOrder;
  };
  getReviews: (shoeId: string) => void;
  getShoeInfo: (shoeId: string) => void;
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
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderBottomColor: 'lightgray',
  },
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginHorizontal: '15%',
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
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  bottomButtonStyle: {
    height: themes.RegularButtonHeight,
    width: Dimensions.get('window').width * 0.45,
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
    reviewState: state.ProductState.reviewState,
    shoeInfoState: state.ProductState.infoState,
    account: state.UserState.accountState.account,
    profile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    getReviews: (shoeId: string): void => dispatch(getReviews(shoeId)),
    getShoeInfo: (shoeId: string): void => dispatch(getShoeInfo(shoeId)),
  }),
)
export class ProductDetail extends React.Component<Props> {
  private _shoe = this.props.route.params.shoe;

  public componentDidMount(): void {
    this._getShoeData();
  }

  private _getShoeData() {
    this.props.getReviews(this._shoe._id);
    this.props.getShoeInfo(this._shoe._id);
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View
            style={{
              paddingTop: insets.top,
              ...styles.rootContainer,
            }}>
            {this._renderHeader(insets.top)}
            <ScrollView
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={
                    this.props.reviewState.state ===
                      NetworkRequestState.REQUESTING ||
                    this.props.shoeInfoState.state ===
                      NetworkRequestState.REQUESTING
                  }
                  onRefresh={this._getShoeData.bind(this)}
                />
              }>
              <View
                style={{
                  ...styles.pageContainer,
                  marginBottom: insets.bottom + themes.RegularButtonHeight,
                }}>
                {this._renderProductImage()}
                {this._renderProductTitle()}
                {this._renderProductDescription()}
                {this._renderProductDetail()}
                {this._renderProductReviews()}
                {this._renderRelatedShoes()}
              </View>
            </ScrollView>
            {this._renderActionButtons(insets.bottom)}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderHeader(topInsets: number): JSX.Element {
    return (
      <HeaderHeightContext.Consumer>
        {(headerHeight): JSX.Element => {
          return (
            <View
              style={{
                ...styles.headerContainer,
                height:
                  headerHeight > 0
                    ? headerHeight + topInsets
                    : themes.IosHeaderHeight,
              }}>
              <Icon
                name={'ios-arrow-back'}
                type={'ionicon'}
                size={themes.IconSize}
                onPress={(): void => this.props.navigation.goBack()}
                hitSlop={styles.backHitSlop}
              />
              <AppText.Title3>{strings.ProductDetail}</AppText.Title3>
              <Icon name={'share'} type={'feather'} size={themes.IconSize} />
            </View>
          );
        }}
      </HeaderHeightContext.Consumer>
    );
  }

  private _renderProductImage(): JSX.Element {
    return (
      <View style={styles.shoeImageContainer}>
        <Image
          source={{uri: this._shoe.imageUrl}}
          style={{width: '100%', aspectRatio: 2}}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  private _renderProductTitle(): JSX.Element {
    return (
      <AppText.Title2 style={styles.shoeTitle} numberOfLines={3}>
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
    return <View style={{paddingHorizontal: 20}}>{views}</View>;
  }

  private _renderProductReviews(): JSX.Element {
    const {reviewState, navigation} = this.props;
    const {state, reviews} = reviewState;

    let content: JSX.Element;
    if (state === NetworkRequestState.REQUESTING) {
      content = <ActivityIndicator />;
    } else if (state === NetworkRequestState.SUCCESS && reviews.length > 0) {
      <View>
        {reviews.slice(0, 2).map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </View>;
    } else {
      content = null;
    }

    return (
      <View style={{paddingHorizontal: 20, alignItems: 'flex-start'}}>
        <View style={styles.ratingHeaderContainer}>
          <AppText.Headline>{strings.Rating.toUpperCase()}</AppText.Headline>
        </View>
        {this._renderAddReview()}
        {content}
        {reviews.length >= 3 ? (
          <View style={{flex: 1, flexDirection: 'row-reverse'}}>
            <AppText.Callout
              style={{color: '#808080'}}
              onPress={(): void => {
                // @ts-ignore
                navigation.push(RouteNames.Product.AllReviews, {
                  reviews: reviews,
                  shoe: this._shoe,
                });
              }}>
              {strings.SeeMore}
            </AppText.Callout>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }

  private _renderAddReview(): JSX.Element {
    return (
      <TouchableOpacity onPress={this._onAddReview.bind(this)}>
        <View style={styles.addReview}>
          <Icon
            name={'edit'}
            size={themes.IconSize}
            color={themes.AppPrimaryColor}
          />
          <AppText.Body
            style={{color: themes.AppPrimaryColor, marginHorizontal: 6}}>
            {strings.AddReview}
          </AppText.Body>
        </View>
      </TouchableOpacity>
    );
  }

  private _onAddReview(): void {
    const {profile, navigation} = this.props;
    if (
      profile.userProvidedName &&
      profile.userProvidedName.firstName &&
      profile.userProvidedName.lastName
    ) {
      // @ts-ignore
      navigation.push(RouteNames.Product.NewReview, {shoe: this._shoe});
    } else {
      this._alertMissingInfo(strings.MissingInfoForReview);
    }
  }

  private _alertMissingInfo(message: string): void {
    const {navigation} = this.props;
    Alert.alert(strings.AccountInfo, message, [
      {
        text: strings.AddInfoForReview,
        onPress: (): void =>
          // @ts-ignore
          navigation.navigate(RouteNames.Tab.AccountTab.Name, {
            screen: RouteNames.Tab.AccountTab.EditProfile,
          }),
      },
      {
        text: strings.Cancel,
        onPress: null,
        style: 'cancel',
      },
    ]);
  }

  private _renderRelatedShoes(): JSX.Element {
    let content: JSX.Element;
    const {shoeInfoState} = this.props;

    if (shoeInfoState.state === NetworkRequestState.REQUESTING) {
      content = <ActivityIndicator size={'large'} />;
    } else if (shoeInfoState.state === NetworkRequestState.SUCCESS) {
      content = (
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 20, paddingBottom: 10}}
          data={shoeInfoState.relatedShoes}
          keyExtractor={(itm): string => itm._id}
          renderItem={({item}): JSX.Element => (
            <LiteShoeCard
              shoe={item}
              onPress={(): void =>
                // @ts-ignore
                this.props.navigation.push(RouteNames.Product.ProductDetail, {
                  shoe: item,
                })
              }
              style={{marginRight: 20, paddingBottom: 8}}
            />
          )}
        />
      );
    }

    return (
      <View style={{flex: 1, paddingHorizontal: 20}}>
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
    const {highestBuyOrder, lowestSellOrder} = this.props.shoeInfoState;
    return (
      <View style={{bottom, ...styles.bottomContainer}}>
        {this._renderSingleActionButton(
          'Mua',
          () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.NewBuyOrder,
              params: {
                shoe: this._shoe,
              },
            });
          },
          lowestSellOrder,
        )}
        {this._renderSingleActionButton(
          'Bán',
          () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.NewSellOrder,
              params: {
                shoe: this._shoe,
                highestBuyOrder: highestBuyOrder,
                lowestSellOrder: lowestSellOrder,
              },
            });
          },
          highestBuyOrder,
        )}
      </View>
    );
  }

  private _renderSingleActionButton(
    actionType: string,
    onPress: () => void,
    order?: SellOrder | BuyOrder,
  ): JSX.Element {
    const {account, profile, navigation} = this.props;
    const isAccountAvailable = Boolean(account && profile);

    const isVerified = account?.isVerified;
    const missingAddress =
      !profile?.userProvidedAddress ||
      !profile?.userProvidedAddress.city ||
      !profile?.userProvidedAddress.districtId ||
      !profile?.userProvidedAddress.wardCode ||
      !profile?.userProvidedAddress.streetAddress;

    let backgroundColor: string;
    let subtitle: string;
    let price: string;
    switch (actionType) {
      case 'Mua':
        backgroundColor = '#1E2330';
        subtitle = 'thấp nhất';
        price = order ? toCurrencyString((order as SellOrder).sellPrice) : '-';
        break;
      default:
        backgroundColor = themes.AppSellColor;
        subtitle = 'cao nhất';
        toCurrencyString;
        price = order ? toCurrencyString((order as BuyOrder).buyPrice) : '-';
    }

    const newOnPress = (): void => {
      if (!isAccountAvailable) {
        // @ts-ignore
        navigation.navigate(RouteNames.Auth.Name, {
          screen: RouteNames.Auth.Login,
        });
      } else if (isVerified && !missingAddress) {
        return onPress();
      } else if (!isVerified) {
        Alert.alert(strings.AccountNotVerifieid);
      } else {
        this._alertMissingInfo(
          `${strings.AddInfoForReview}: ${strings.MissingAddress}`,
        );
      }
    };

    return (
      <TouchableOpacity onPress={newOnPress}>
        <View
          style={{
            backgroundColor,
            ...styles.bottomButtonStyle,
            ...themes.ButtonShadow,
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText.Title3 style={{color: themes.AppAccentColor}}>
              {actionType.toUpperCase()}
            </AppText.Title3>
          </View>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <View>
              <AppText.Body style={{color: themes.AppAccentColor}}>
                {subtitle}
              </AppText.Body>
              <AppText.SubCallout
                style={{color: themes.AppAccentColor, alignSelf: 'center'}}>
                {price}
              </AppText.SubCallout>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
