import * as React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {Divider} from 'react-native-elements';
import {} from 'react-native-gesture-handler';
import ImagePicker, {ImagePickerOptions} from 'react-native-image-picker';
import {AppText} from 'screens/Shared';
import {SellOrder} from 'business';
import {toCurrencyString} from 'utilities';
import {images, strings} from 'resources';
import {Profile} from 'business';
import { OrderType } from 'business/src';

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  shippingInfoSectionContainer: {
    marginTop: 0,
  },

  shippingInfoDescriptionContainer: {
    marginTop: 20,
  },

  shippingInfoTopDivider: {
    marginTop: 30,
    marginBottom: 25,
  },

  shippingInfoBottomDivider: {
    marginTop: 25,
  },

  shippingInfoDetails: {
    marginTop: 10,
  },

  editShippingInfo: {
    color: '#E2603F',
  },

  imageContainer: {
    width: 95,
    aspectRatio: 1,
    marginRight: 12,
  },
});

type Props = {
  orderType: OrderType;
  shoeSize: string;
  isNewShoe: boolean;
  price: number;
  shippingFee?: number;
  // orderSummary: Partial<SellOrder>;
  userProfile: Profile;
  onShoePictureAdded: (picUri: string) => void;
  onEditShippingInfo: () => void;
};

export class OrderSummary extends React.Component<Props> {
  private readonly imagePickerOptions: ImagePickerOptions = {
    allowsEditing: true,
    mediaType: 'photo',
    quality: 0.75,
  };

  public /** override */ render(): JSX.Element {
    return (
      <View style={{flex: 1, width: Dimensions.get('screen').width}}>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this._renderSummaryDetail(
            'Cỡ giày',
            this.props.shoeSize,
          )}
          {this._renderSummaryDetail(
            'Tình trạng',
            this.props.isNewShoe ? 'Mới' : 'Cũ',
          )}
          {this._renderShippingInfo()}
          {this._renderSummaryDetail(
            this.props.orderType === 'SellOrder' ? 'Giá bán' : 'Giá mua',
            toCurrencyString(this.props.price),
          )}
          {this.props.shippingFee >= 0 && this._renderSummaryDetail('Phí vận chuyển', toCurrencyString(this.props.shippingFee))}
          {this.props.shippingFee >= 0 && this._renderSummaryDetail('Tổng cộng', toCurrencyString(this.props.price + this.props.shippingFee))}
          {/* {!this.props.isNewShoe && this._renderPictures()} */}
        </View>
      </View>
    );
  }

  private _renderSummaryDetail(field: string, value: string): JSX.Element {
    return (
      <View style={styles.sectionContainer}>
        <AppText.SubHeadline>{field}</AppText.SubHeadline>
        <AppText.Body>{value}</AppText.Body>
      </View>
    );
  }

  private _renderShippingInfo(): JSX.Element {
    return (
      <View>
        <Divider style={styles.shippingInfoTopDivider} />
        <View
          style={[
            styles.sectionContainer,
            styles.shippingInfoSectionContainer,
          ]}>
          <AppText.SubHeadline>{'Thông tin giao hàng'}</AppText.SubHeadline>
          <AppText.Body
            style={styles.editShippingInfo}
            onPress={() => this.props.onEditShippingInfo()}>
            {'Thay đổi'}
          </AppText.Body>
        </View>
        {this._shouldRenderShippingInfoDetails() && (
          <View style={styles.shippingInfoDescriptionContainer}>
            {this._renderName()}
            {this._renderShippingInfoDetails()}
          </View>
        )}
        <Divider style={styles.shippingInfoBottomDivider} />
      </View>
    );
  }

  private _shouldRenderShippingInfoDetails(): boolean {
    const profile = this.props.userProfile;
    if (
      !profile.userProvidedName?.firstName ||
      !profile.userProvidedName?.lastName
    ) {
      return false;
    } else if (!profile.userProvidedEmail) {
      return false;
    } else if (!profile.userProvidedPhoneNumber) {
      return false;
    } else if (
      !profile.userProvidedAddress?.streetAddress ||
      !profile.userProvidedAddress?.ward ||
      !profile.userProvidedAddress?.district ||
      !profile.userProvidedAddress?.city
    ) {
      return false;
    }
    return true;
  }

  private _renderName(): JSX.Element {
    const name = `${this.props.userProfile.userProvidedName.firstName} ${this.props.userProfile.userProvidedName.lastName}`;
    return <AppText.Body>{name}</AppText.Body>;
  }

  private _renderShippingInfoDetails(): JSX.Element {
    const profile = this.props.userProfile;
    const phoneNumber = profile.userProvidedPhoneNumber;
    const {streetAddress, ward, district, city} = profile.userProvidedAddress;
    return (
      <>
        <AppText.Footnote style={styles.shippingInfoDetails}>
          {phoneNumber}
        </AppText.Footnote>
        <AppText.Footnote style={styles.shippingInfoDetails}>
          {streetAddress}
        </AppText.Footnote>
        <AppText.Footnote
          style={
            styles.shippingInfoDetails
          }>{`${ward} - ${district} - ${city}`}</AppText.Footnote>
      </>
    );
  }

  // private _renderPictures(): JSX.Element {
  //   return (
  //     <View style={{flex: 1, flexDirection: 'column'}}>
  //       <AppText.Body>{strings.ProductPictures}</AppText.Body>
  //       <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
  //         <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
  //           <TouchableOpacity onPress={this._launchImagePicker.bind(this)}>
  //             <Image
  //               source={images.CameraPlaceholder}
  //               style={styles.imageContainer}
  //             />
  //           </TouchableOpacity>
  //           {this.props.orderSummary?.pictures?.map((item, index) => (
  //             <Image
  //               key={index}
  //               source={{uri: item}}
  //               style={styles.imageContainer}
  //               resizeMode={'cover'}
  //             />
  //           ))}
  //         </View>
  //       </ScrollView>
  //     </View>
  //   );
  // }

  private _launchImagePicker(): void {
    ImagePicker.launchImageLibrary(this.imagePickerOptions, (result) => {
      if (!result.didCancel) {
        this.props.onShoePictureAdded(result.uri);
      }
    });
  }
}
