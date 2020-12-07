import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {
  AppText,
  BottomButton,
  ShoeHeaderSummary,
  DismissKeyboardView,
} from 'screens/Shared';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import {RouteProp} from '@react-navigation/native';
import {Shoe, IShoeService, FactoryKeys, Review} from 'business';
import {Rating, Input} from 'react-native-elements';
import {themes, strings} from 'resources';
import {connect} from 'utilities/ReduxUtilities';
import {
  toggleIndicator,
  showErrorNotification,
  showSuccessNotification,
} from 'actions';
import {IAppState} from 'store/AppStore';
import {getToken, getDependency} from 'utilities';

type Props = {
  route: RouteProp<RootStackParams, 'ProductNewReview'>;
  navigation: StackNavigationProp<RootStackParams, 'ProductNewReview'>;

  showSuccessNotification: (msg: string) => void;
  showErrorNotification: (msg: string) => void;
  toggleLoadingIndicator: (isLoading: boolean, message?: string) => void;
};

type State = {
  rating: number;
  description: string;
};

@connect(
  (_: IAppState) => ({}),
  (dispatch: Function) => ({
    showSuccessNotification: (message: string): void => {
      dispatch(showSuccessNotification(message));
    },
    showErrorNotification: (message: string): void => {
      dispatch(showErrorNotification(message));
    },
    toggleLoadingIndicator: (isLoading: boolean, message?: string): void => {
      dispatch(toggleIndicator({isLoading, message}));
    },
  }),
)
export class NewReview extends React.Component<Props, State> {
  private shoe: Shoe = this.props.route.params.shoe;
  private unmountTimeout = 0;

  state = {
    description: '',
    rating: 0,
  };

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <DismissKeyboardView style={{flex: 1, position: 'relative'}}>
          <ShoeHeaderSummary shoe={this.shoe} />
          <View style={{padding: 20}}>
            {this._renderRatingView()}
            {this._renderDescriptionView()}
          </View>
          <BottomButton
            style={{backgroundColor: themes.AppPrimaryColor}}
            title={strings.PostRating}
            onPress={this._postReview.bind(this)}
          />
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }

  public componentWillUnmount() {
    clearTimeout(this.unmountTimeout);
  }

  private _renderRatingView(): JSX.Element {
    const {rating} = this.state;

    return (
      <View>
        <AppText.Body style={{marginBottom: 10}}>
          {strings.RatingTitle}
          <AppText.Headline style={{color: themes.AppPrimaryColor}}>
            {' ' + rating.toString()}/5
          </AppText.Headline>
        </AppText.Body>
        <Rating
          ratingCount={5}
          startingValue={rating}
          type={'custom'}
          imageSize={themes.IconSize + 10}
          onFinishRating={(rating) => this.setState({rating})}
          fractions={0}
        />
      </View>
    );
  }

  private _renderDescriptionView(): JSX.Element {
    const {description} = this.state;

    return (
      <View style={{marginTop: 20}}>
        <AppText.Body>{strings.Detail}</AppText.Body>
        <Input
          value={description}
          onChangeText={(description) => this.setState({description})}
          placeholder={strings.RatingPlaceHolder}
          inputStyle={themes.TextStyle.body}
          multiline={true}
          numberOfLines={5}
          underlineColorAndroid={'transparent'}
          containerStyle={{marginTop: 10}}
        />
      </View>
    );
  }

  private async _postReview(): Promise<void> {
    const {rating, description} = this.state;
    const {
      toggleLoadingIndicator,
      navigation,
      showErrorNotification,
    } = this.props;

    const shoeService = getDependency<IShoeService>(FactoryKeys.IShoeService);
    const token = getToken();

    toggleLoadingIndicator(true);
    try {
      await shoeService.addReview(token, {
        shoeId: this.shoe._id,
        rating,
        description,
        imageUrls: [],
      } as Review);

      showSuccessNotification('Đã đánh giá sản phẩm thành công');

      this.unmountTimeout = setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      showErrorNotification('Đã có lỗi xảy ra');
    } finally {
      toggleLoadingIndicator(false);
    }
  }
}
