import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Divider} from 'react-native-elements';
import {} from 'react-native-gesture-handler';
import {AppText} from 'screens/Shared';
import {toCurrencyString} from 'utilities';
import {Profile} from 'business';

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
  shoeSize: string;
  price: number;
  inventoryId: string;
  // orderSummary: Partial<SellOrder>;
  userProfile: Profile;
  onEditShippingInfo: () => void;
};

export class OrderSummary extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <View style={{flex: 1, width: Dimensions.get('screen').width}}>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this._renderSummaryDetail('Cỡ giày', this.props.shoeSize)}
          {this._renderSummaryDetail(
            'Giá bán',
            toCurrencyString(this.props.price),
          )}
          {this._renderShippingInfo()}
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
}
