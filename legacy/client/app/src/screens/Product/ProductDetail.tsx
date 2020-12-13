import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
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
import {AppText, LiteShoeCard} from 'screens/Shared';
import {strings, themes} from 'resources';
import {
  connect,
  toVnDateFormat,
  toCurrencyString,
  convertUsdToVnd,
} from 'utilities';
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
    width: Dimensions.get('window').width * 0.75,
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
    this.props.getShoeInfo(this._shoe._id);
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View
            style={{
              ...styles.rootContainer,
            }}>
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
                {this._renderRelatedShoes()}
              </View>
            </ScrollView>
            {this._renderActionButtons(insets.bottom)}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderProductImage(): JSX.Element {
    return (
      <View style={styles.shoeImageContainer}>
        <Image
          source={{uri: this._shoe.media.imageUrl}}
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
                this.props.navigation.push(RouteNames.Product.Name, {
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
    const {profile, account} = this.props;
    const isSell = account && profile && profile.isSeller && account.isVerified;
    const {highestBuyOrder, lowestSellOrder} = this.props.shoeInfoState;
    return (
      <View style={{bottom, ...styles.bottomContainer}}>
        {!isSell &&
          this._renderSingleActionButton(
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
        {isSell &&
          this._renderSingleActionButton(
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
      profile &&
      !profile.isSeller &&
      (!profile?.userProvidedAddress ||
        !profile?.userProvidedAddress.addressLine1 ||
        !profile?.userProvidedAddress.addressLine1);

    let backgroundColor: string;
    let subtitle: string;
    let price: string;
    switch (actionType) {
      case 'Mua':
        backgroundColor = themes.AppPrimaryColor;
        subtitle = 'thấp nhất';
        price = order ? toCurrencyString((order as SellOrder).sellPrice) : '-';
        break;
      default:
        backgroundColor = themes.AppSellColor;
        subtitle = 'cao nhất';
        toCurrencyString;
        price = order ? toCurrencyString((order as BuyOrder).buyPrice) : '-';
    }

    const onPressWrapper = (): void => {
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
      <TouchableOpacity onPress={onPressWrapper}>
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
