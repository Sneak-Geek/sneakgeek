import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {AppText, BottomButton} from 'screens/Shared';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams} from 'navigations/RootStack';
import {
  StackNavigationProp,
  HeaderHeightContext,
} from '@react-navigation/stack';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {themes, strings} from 'resources';
import {Icon, Rating} from 'react-native-elements';
import {
  Review,
  Shoe,
  ObjectFactory,
  Profile,
  IShoeService,
  FactoryKeys,
} from 'business';
import {ReviewItem} from '../Shared';
import '../Shared/BottomButton';
import RouteNames from 'navigations/RouteNames';
import {toggleIndicator, showErrorNotification} from 'actions';
import {IAppState} from 'store/AppStore';
import {getToken, connect} from 'utilities';

type Props = {
  navigation: StackNavigationProp<RootStackParams, 'ProductAllReviews'>;
  route: RouteProp<RootStackParams, 'ProductAllReviews'>;
  showErrorNotification: (msg: string) => void;
  toggleLoadingIndicator: (isLoading: boolean, message?: string) => void;
  profile: Profile;
};

type State = {
  reviewStatistics: {
    avg: number;
    ratingCounts: Array<{
      count: number;
      rating: number;
    }>;
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'white',
    flex: 1,
    position: 'relative',
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
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  backHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  sortingContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  reviewStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  displayRating: {
    color: '#1ABC9C',
    textAlign: 'center',
  },
});

@connect(
  (state: IAppState) => ({
    profile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    showErrorNotification: (message: string): void => {
      dispatch(showErrorNotification(message));
    },
    toggleLoadingIndicator: (isLoading: boolean, message?: string): void => {
      dispatch(toggleIndicator({isLoading, message}));
    },
  }),
)
export class AllReviews extends React.Component<Props> {
  private reviews: Review[] = this.props.route.params.reviews;
  private shoe: Shoe = this.props.route.params.shoe;
  private readonly _shoeService = ObjectFactory.getObjectInstance<IShoeService>(
    FactoryKeys.IShoeService,
  );

  state: State = {
    reviewStatistics: {
      avg: 0,
      ratingCounts: [],
    },
  };

  async componentDidMount() {
    await this.getReviewStats(this.shoe._id);
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
              style={{
                flex: 1,
                marginBottom: insets.bottom + themes.RegularButtonHeight,
              }}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  ...styles.pageContainer,
                }}>
                {this._renderStats()}
                {this._renderSortingBar()}
                {this._renderReviews(this.reviews)}
              </View>
            </ScrollView>
            {this._renderAddReviewButton(insets.bottom)}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderHeader(topInsets: number): JSX.Element {
    return (
      <HeaderHeightContext.Consumer>
        {(headerHeight) => (
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
              hitSlop={styles.backHitSlop}
              onPress={() => this.props.navigation.goBack()}
            />
            <AppText.Title3>{strings.AllReviews}</AppText.Title3>
            <Icon
              color="white"
              name={'ios-arrow-back'}
              type={'ionicon'}
              size={themes.IconSize}
              hitSlop={styles.backHitSlop}
            />
          </View>
        )}
      </HeaderHeightContext.Consumer>
    );
  }

  private _renderSortingBar(): JSX.Element {
    return (
      <View style={{...styles.sortingContainer}}>
        <Icon
          name={'tune'}
          size={themes.IconSize * 0.95}
          hitSlop={styles.backHitSlop}
          onPress={() => {}}
        />
        <AppText.Body style={{paddingLeft: 5}}>
          {strings.SortByDate}
        </AppText.Body>
      </View>
    );
  }

  private _renderStats(): JSX.Element {
    const reviewStats = this.state.reviewStatistics;
    if (reviewStats) {
      let totalRatingCount = 0;
      const numStars = [0, 0, 0, 0, 0];
      reviewStats.ratingCounts.map((ratingCount) => {
        numStars[5 - ratingCount.rating] = ratingCount.count;
        totalRatingCount += ratingCount.count;
      });
      const avgRating = Math.round(reviewStats.avg * 10) / 10;
      let displayRating: JSX.Element;
      if (avgRating === 0) {
        displayRating = (
          <AppText.Title1 style={styles.displayRating}> - /5 </AppText.Title1>
        );
      } else {
        displayRating = (
          <AppText.Title1 style={styles.displayRating}>
            {' '}
            <AppText.LargeTitle style={{fontSize: 40}}>
              {avgRating}
            </AppText.LargeTitle>{' '}
            /5{' '}
          </AppText.Title1>
        );
      }
      let starIndex = 6;

      return (
        <View style={{...styles.reviewStatsContainer, padding: 20}}>
          <View>
            {displayRating}
            <AppText.Title2 style={{fontSize: 20, textAlign: 'center'}}>
              Tổng quan
            </AppText.Title2>
            <AppText.Caption1
              style={{fontSize: 16, marginVertical: 5, textAlign: 'center'}}>
              {totalRatingCount} đánh giá
            </AppText.Caption1>
          </View>
          <View>
            {numStars.map((star, index) => {
              starIndex--;
              return (
                <View key={index} style={{flexDirection: 'row'}}>
                  <AppText.Body style={{paddingRight: 10}}>
                    {star} người
                  </AppText.Body>
                  <Rating
                    ratingColor={themes.AppPrimaryColor}
                    startingValue={starIndex}
                    readonly
                    imageSize={themes.IconSize / 1.5}
                  />
                </View>
              );
            })}
          </View>
        </View>
      );
    }
    return <AppText.Title1 />;
  }
  private _renderReviews(reviews: Review[]): JSX.Element {
    if (this.state.reviewStatistics.avg === 0) {
      return (
        <AppText.Body style={{textAlign: 'center', paddingVertical: 150}}>
          {strings.NoRating}
        </AppText.Body>
      );
    }
    return (
      <ScrollView
        style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}
        showsVerticalScrollIndicator={false}>
        {reviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </ScrollView>
    );
  }

  private _renderAddReviewButton(bottom: number): JSX.Element {
    const newOnPress = (): void => {
      const {profile} = this.props;
      if (
        profile.userProvidedName &&
        profile.userProvidedName.firstName &&
        profile.userProvidedName.lastName
      ) {
        // @ts-ignore
        this.props.navigation.push(RouteNames.Product.NewReview, {
          shoe: this.shoe,
        });
      } else {
        this.alertMissingInfo(strings.MissingInfoForReview);
      }
    };
    return (
      <BottomButton
        style={{bottom, backgroundColor: themes.AppSecondaryColor}}
        title={strings.AddReview}
        onPress={newOnPress}
      />
    );
  }

  private alertMissingInfo = (message: string): void => {
    const {navigation} = this.props;
    Alert.alert(strings.AccountInfo, message, [
      {
        text: strings.AddInfoForReview,
        onPress: (): void =>
          // @ts-ignore
          navigation.navigate(RouteNames.Tab.AccountTab.Name, {
            // @ts-ignore
            screen: RouteNames.Tab.AccountTab.ViewProfile,
          }),
      },
      {
        text: strings.Cancel,
        onPress: null,
        style: 'cancel',
      },
    ]);
  };

  private async getReviewStats(shoeId: string) {
    const {toggleLoadingIndicator, showErrorNotification} = this.props;
    toggleLoadingIndicator(true);
    try {
      const response = await this._shoeService.getReviewStats(shoeId);
      this.setState({reviewStatistics: response});
      return response;
    } catch (error) {
      showErrorNotification(strings.Error);
    } finally {
      toggleLoadingIndicator(false);
    }
  }
}
